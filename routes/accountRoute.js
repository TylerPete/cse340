const express = require("express")
const router = new express.Router()
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")

router.get("/login", utilities.handleErrors(actController.buildLogin))

module.exports = router