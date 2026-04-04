const express = require("express")
const router = new express.Router()
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to build login view
router.get("/login", utilities.handleErrors(actController.buildLogin))

// Route to build registration view
router.get("/registration", utilities.handleErrors(actController.buildRegistration))

module.exports = router