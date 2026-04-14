const utilities = require(".")
const actModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ******************************** */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a first name.")
            .bail()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a last name.")
            .bail()
            .isLength( {min: 2 })
            .withMessage("Please provide a valid last name."), //on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide an email address.")
            .bail()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await actModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Please provide a password.")
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***********************************************
 * Check data and return errors or continue to registration
 * ********************************************* */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        res.render("account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* **********************************
 * Login Data Validation Rules
 * ******************************** */
validate.loginRules = () => {
    return [
        // valid email is required
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide an email address.")
            .bail()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Please provide a password.")
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***********************************************
 * Check data and return errors or continue to login
 * ********************************************* */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* **********************************
 * Account Updata Data Validation Rules
 * ******************************** */
validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a first name.")
            .bail()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a last name.")
            .bail()
            .isLength( {min: 2 })
            .withMessage("Please provide a valid last name."), //on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide an email address.")
            .bail()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id

                const emailExists = await actModel.checkExistingEmail(account_email, account_id)
                if (emailExists) {
                    throw new Error("Email exists. Please provide a different email.")
                }
            }),
    ]
}

/* ***********************************************
 * Check data and return errors or continue to update
 * ********************************************* */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

/* **********************************
 * Change Password Data Validation Rules
 * ******************************** */
validate.changePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Please provide a password.")
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************************************
 * Check data and return errors or continue to change password
 * **************************************************** */
validate.checkChangePasswordData = async (req, res, next) => {
    const { account_firstname_hidden, account_lastname_hidden, account_email_hidden, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname: account_firstname_hidden,
            account_lastname: account_lastname_hidden,
            account_email: account_email_hidden,
            account_id
        })
        return
    }
    next()
}

module.exports = validate