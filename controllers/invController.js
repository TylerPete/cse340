const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ******************
 * Build inventory by classification view
 * ****************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    let grid
    let title
    if (data.length > 0) {
        grid = await utilities.buildClassificationGrid(data)
        title = data[0].classification_name + " vehicles"
    } else {
        grid = "<p class='notice'>Sorry, no vehicles of this classification are currently available.</p>"
        title = "No vehicles found"
    }

    let nav = await utilities.getNav()

    res.render("./inventory/classification", {
        title,
        nav,
        grid
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

/* ******************
 * Build vehicle management view
 * ****************** */
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    if (res.locals.managementAccess) {
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationList
        })
    } else {
        req.flash("notice", "Please log in as Employee/Admin to access this view.")
        res.redirect("/account/login")
    }
}

/* ******************
 * Build add new classification view
 * ****************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()

    if (res.locals.managementAccess) {
        res.render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Please log in as Employee/Admin to access this view.")
        res.redirect("/account/login")
    }
}

/* ********************************
 * Process New Classification Addition
 * ****************************** */
invCont.addNewClassification = async function (req, res) {
    const { classification_name } = req.body

    const addResult = await invModel.addNewClassification(
        classification_name
    )

    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    if (addResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationList
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

/* ********************************
 * Build add new inventory view
 * ****************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    if (res.locals.managementAccess) {
        res.render("./inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            errors: null,
            classificationList
        })
    } else {
        req.flash("notice", "Please log in as Employee/Admin to access this view.")
        res.redirect("/account/login")
    }
}

/* ********************************
 * Process New Inventory Addition
 * ****************************** */
invCont.addNewInventory = async function (req, res) {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

    const addResult = await invModel.addNewInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )

    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    if (addResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} vehicle was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationList
        })
    } else {
        req.flash("notice", "Sorry, the vehicle addition failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            errors: null,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classificationList
        })
    }
}

/* *******************************************
 * Return Inventory by Classification As JSON
 * ***************************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ********************************
 * Build edit inventory view
 * ****************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleDetailsByInventoryId(inventory_id)
    const item = itemData[0]
    const classificationList = await utilities.buildClassificationList(item.classification_id)
    
    const name = `${item.inv_make} ${item.inv_model}`

    if (res.locals.managementAccess) {
        res.render("./inventory/edit-inventory", {
            title: "Edit " + name,
            nav,
            errors: null,
            classificationList: classificationList,
            inv_id: item.inv_id,
            inv_make: item.inv_make,
            inv_model: item.inv_model,
            inv_year: item.inv_year,
            inv_description: item.inv_description,
            inv_image: item.inv_image,
            inv_thumbnail: item.inv_thumbnail,
            inv_price: item.inv_price,
            inv_miles: item.inv_miles,
            inv_color: item.inv_color,
            classification_id: item.classification_id        
        })
    } else {
        req.flash("notice", "Please log in as Employee/Admin to access this view.")
        res.redirect("/account/login")
    }
}

/* ********************************
 * Update Inventory Data
 * ****************************** */
invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash(
            "notice",
            `The ${itemName} was successfully updated.`)
            res.redirect("/inv/")
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* ********************************
 * Build delete inventory confirmation view
 * ****************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleDetailsByInventoryId(inventory_id)
    const item = itemData[0]

    const name = `${item.inv_make} ${item.inv_model}`

    if (res.locals.managementAccess) {
        res.render("./inventory/delete-confirm", {
            title: "Delete " + name,
            nav,
            errors: null,
            inv_id: item.inv_id,
            inv_make: item.inv_make,
            inv_model: item.inv_model,
            inv_year: item.inv_year,
            inv_price: item.inv_price,       
        })
    } else {
        req.flash("notice", "Please log in as Employee/Admin to access this view.")
        res.redirect("/account/login")
    }
}

/* ********************************
 * Delete Inventory Data
 * ****************************** */
invCont.deleteInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_price, inv_year, inv_id } = req.body

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
        req.flash(
            "notice",
            `The ${itemName} was successfully deleted.`)
            res.redirect("/inv/")
    } else {
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the deletion failed.")
        res.status(501).render("inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            errors: null,
            inv_make,
            inv_model,
            inv_price,
            inv_year,
            inv_id
        })
    }
}

invCont.triggerError = function(req, res, next) {
    next(new Error("Test 500 error"))
}

module.exports = invCont