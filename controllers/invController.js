const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ******************
 * Build inventory by classification view
 * ****************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ******************
 * Build vehicle by inventory id view
 * ****************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getVehicleDetailsByInventoryId(inventory_id)
    const grid = await utilities.buildVehicleDetailsGrid(data)
    let nav = await utilities.getNav()
    const year = data[0].inv_year
    const make = data[0].inv_make
    const model = data[0].inv_model

    res.render("./inventory/vehicle", {
        title: year + ' ' + make + ' ' + model,
        nav,
        grid,
    })
}

invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

/* ******************
 * Build add new classification view
 * ****************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}

/* ********************************
 * Process New Classification Addition
 * ****************************** */

async function addNewClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const addResult = await invModel.addNewClassification(
        classification_name
    )

    if (addResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the classification addition failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }
}

invCont.triggerError = function(req, res, next) {
    next(new Error("Test 500 error"))
}

module.exports = invCont