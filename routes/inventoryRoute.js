// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const newInvValidate = require("../utilities/new-inventory-validation")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build one vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory))

// Route to process new classification addition
router.post(
    '/add-classification',
    newInvValidate.classificationRules(),
    newInvValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification))

// Route to process new inventory addition
router.post(
    '/add-inventory',
    newInvValidate.inventoryRules(),
    newInvValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory))

// router.get("/error-test", invController.triggerError);

module.exports = router;