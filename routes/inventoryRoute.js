// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build one vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))


// router.get("/error-test", invController.triggerError);

module.exports = router;