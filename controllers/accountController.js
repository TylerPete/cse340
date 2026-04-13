const utilities = require("../utilities/")
const actModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* **************************
 * Deliver login view
 * ************************ */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* **************************
 * Deliver registration view
 * ************************ */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Register",
        nav,
        errors: null
    })
}

/* **********************
 * Process Registration
 * ******************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/registration", {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email
        })
    }

    const regResult = await actModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

/* ************************
 * Process login request
 * ********************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await actModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    }   catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* **************************
 * Deliver account management view
 * ************************ */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management.ejs", {
        title: "Account Management",
        nav,
        errors: null
    })
}

/* **************************
 * Process logout attempt
 * ************************ */
async function logOut(req, res, next) {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")

    return res.redirect("/")
}

/* **************************
 * Deliver update account info view
 * ************************ */
async function buildUpdateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = req.params.accountId

    const itemData = await actModel.getAccountDetailsById(account_id)

    res.render("account/update.ejs", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname: itemData.account_firstname,
        account_lastname: itemData.account_lastname,
        account_email: itemData.account_email
    })
}

/* **********************
 * Process account update
 * ******************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await actModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )

    if (updateResult) {
        const updatedAccount = updateResult.rows[0]

        const newToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3600 * 1000
        })
        res.cookie("jwt", newToken, {httpOnly: true, maxAge: 3600 * 100})
        
        req.flash(
            "notice",
            `You\'ve successfully updated your account info, ${account_firstname}.`
        )
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry, the account update failed.")
        res.status(501).render("account/update", {
            title: "Edit Account",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

/* **********************
 * Process password change
 * ******************** */
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname_hidden, account_lastname_hidden, account_email_hidden, account_password, account_id } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password change.')
        res.status(500).render("account/update", {
            errors: null,
            title: "Edit Account",
            nav,
            account_firstname: account_firstname_hidden,
            account_lastname: account_lastname_hidden,
            account_email: account_email_hidden,
            account_id
        })
    }

    const changePasswordResult = await actModel.changePassword(hashedPassword, account_id)

    if (changePasswordResult) {
        req.flash(
            "notice",
            `You\'ve successfully changed your password, ${account_firstname_hidden}.`
        )
        res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the password change failed.")
        res.status(501).render("account/update", {
            errors: null,
            title: "Edit Account",
            nav,
            account_firstname: account_firstname_hidden,
            account_lastname: account_lastname_hidden,
            account_email: account_email_hidden,
            account_id
        })
    }
}

/* ***************
 * Add favorite
 * ************* */
async function addFavorite(req, res) {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    const addFavoriteResult = await actModel.addFavorite(account_id, inv_id)

    if (addFavoriteResult) {
        req.flash("notice", "Vehicle added to favorites.")
    } else {
        req.flash("notice", "Vehicle is already in your favorites.")
    }

    res.redirect(`/inv/detail/${inv_id}`)
}

/* **************
 * Delete favorite
 * ************ */
async function deleteFavorite(req, res) {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    const deleteFavoriteResult = await actModel.deleteFavorite(account_id, inv_id)
    
    if (deleteFavoriteResult) {
        req.flash("notice", "Vehicle removed from favorites.")
    } else {
        req.flash("notice", "Favorite not found.")
    }

    res.redirect(`/inv/detail/${inv_id}`)
}

/* **************************
 * Deliver favorites view
 * ************************ */
async function buildFavoritesView(req, res, next) {
    console.log("buildFavoritesView hit")

    let nav = await utilities.getNav()

    let favoritesData;

    if (res.locals.loggedin) {
        const account_id = res.locals.accountData.account_id
        favoritesData = await actModel.getFavoritesByAccount(account_id)
        res.render("account/favorites", {
            title: "Your Favorites",
            nav,
            errors: null,
            favorites: favoritesData
        })
    } else {
        req.flash("notice", "You must login to access that view.")
        res.redirect("/account/login")
    }


}


module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement, logOut, buildUpdateAccount, updateAccount, changePassword, addFavorite, deleteFavorite, buildFavoritesView }