const express = require("express")
const router = new express.Router()
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(actController.buildLogin))

// Route to build registration view
router.get("/registration", utilities.handleErrors(actController.buildRegistration))

// Route to process registration form(?)
router.post(
    '/registration',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(actController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router