const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Inventory Addition Data Validation Rules
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
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
        })
        return
    }
    next()
}

module.exports = validate