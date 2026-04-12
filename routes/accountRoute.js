const express = require("express")
const router = new express.Router()
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")
const reglogValidate = require("../utilities/account-validation")

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(actController.buildAccountManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(actController.buildLogin))

// Route to build registration view
router.get("/registration", utilities.handleErrors(actController.buildRegistration))

// Route to log out user
router.get("/logout", utilities.handleErrors(actController.logOut))

// Route to build update account info view
router.get("/update/:accountId", utilities.handleErrors(actController.buildUpdateAccount))

// Route to process registration form(?)
router.post(
    '/registration',
    reglogValidate.registrationRules(),
    reglogValidate.checkRegData,
    utilities.handleErrors(actController.registerAccount))

// Route to process the login attempt
router.post(
    "/login",
    reglogValidate.loginRules(),
    reglogValidate.checkLoginData,
    utilities.handleErrors(actController.accountLogin))

// Route to process the account update attempt
router.post(
    "/update",
    reglogValidate.updateRules(),
    reglogValidate.checkUpdateData,
    utilities.handleErrors(actController.updateAccount))

// Route to process the password change attempt
router.post(
    "/change-password",
    reglogValidate.changePasswordRules(),
    reglogValidate.checkChangePasswordData,
    utilities.handleErrors(actController.changePassword))

// Route to process favorite addition
router.post("/favorite/add", utilities.handleErrors(actController.addFavorite))

// Route to process favorite deletion
router.post("/favorite/delete", utilities.handleErrors(actController.deleteFavorite))

// Route to build favorites view
router.get("/favorites", utilities.handleErrors(actController.buildFavoritesView))

module.exports = router