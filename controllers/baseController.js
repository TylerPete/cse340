const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav(req, res)

    res.render("index", {
        title: "Home", 
        nav,
        errors: null
    })
}

module.exports = baseController