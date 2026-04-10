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

// Route to process registration form(?)
router.post(
    '/registration',
    reglogValidate.registrationRules(),
    reglogValidate.checkRegData,
    utilities.handleErrors(actController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    reglogValidate.loginRules(),
    reglogValidate.checkLoginData,
    utilities.handleErrors(actController.accountLogin))

module.exports = router