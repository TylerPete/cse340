const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Addition Data Validation Rules
 * ******************************** */
validate.classificationRules = () => {
    return [
        // classification is required and cannot already exist in the DB
        body("classification_name")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a classification name.")
            .bail()
            .isAlpha()
            .withMessage("Classification name must contain only letters")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use different classification name")
                }
            }),
    ]
}

/* ***********************************************
 * Check data and return errors or continue to add classification
 * ********************************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
        })
        return
    }
    next()
}

/* **********************************
 * Inventory Addition Data Validation Rules
 * ******************************** */
validate.inventoryRules = () => {
    return [
        // make is required and must be 3 or more characters
        body("inv_make")
            .trim()
            .notEmpty().withMessage("Please provide a vehicle make.")
            .bail()
            .isLength({ min: 3 })
            .withMessage("Make must contain 3 or more characters."),

        // model is required and must be 3 or more characters
        body("inv_model")
            .trim()
            .notEmpty().withMessage("Please provide a vehicle model.")
            .bail()
            .isLength({ min: 3 })
            .withMessage("Model must contain 3 or more characters."),

        // description is required
        body("inv_description")
            .trim()
            .notEmpty().withMessage("Please provide a vehicle description."),

        // image path is required
        body("inv_image")
            .trim()
            .notEmpty().withMessage("Please provide an image file path."),

        // thumbnail path is required
        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("Please provide a thumbnail file path."),

        // price is required and must be in a currency format
        body("inv_price")
            .trim()
            .notEmpty().withMessage("Please provide a price.")
            .bail()
            .isCurrency().withMessage("Price must be in currency format."),
        
        // year is required and must be a 4-digit number
        body("inv_year")
            .trim()
            .notEmpty().withMessage("Please provide a year.")
            .bail()
            .isNumeric().withMessage("Year must contain only numeric characters.")
            .bail()
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be exactly 4 digits."),

        // miles is required and must contain only numeric characters
        body("inv_miles")
            .trim()
            .notEmpty().withMessage("Please provide miles.")
            .bail()
            .isNumeric({ no_symbols: true}).withMessage("Miles must contain only numeric characters."),

        // color is required
        body("inv_color")
            .trim()
            .notEmpty().withMessage("Please provide a vehicle color."),
    ]
}

/* ***********************************************
 * Check data and return errors or continue to add inventory
 * ********************************************* */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
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
        return
    }
    next()
}

/* ***********************************************
 * Check data; redirect errors back to the edit inventory view
 * ********************************************* */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(req, res)
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + inv_make + " " + inv_model,
            nav,
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
            classificationList,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate