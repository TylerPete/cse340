const pool = require("../database/")

/* **********************
 * Register new account
 * ******************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* ************************
 * Check for existing email
 ************************ */
async function checkExistingEmail(account_email, account_id = null) {
    try {
        let sql;
        let email;

        if (account_id) {
            sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
            email = await pool.query(sql, [account_email, account_id])
        } else {
            sql = "SELECT * FROM account WHERE account_email = $1"
            email = await pool.query(sql, [account_email])
        }

        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***********************************
 * Return account data using email address
 * ********************************* */
async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* ***********************************
 * Return account data using account_id
 * ********************************* */
async function getAccountDetailsById (account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1',
            [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching account found")
    }
}


/* **********************
 * Update account info
 * ******************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    } catch (error) {
        return error.message
    }
}

/* **********************
 * Change password
 * ******************** */
async function changePassword(account_password, account_id) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        return await pool.query(sql, [account_password, account_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************************
 * Add favorite to database favorite table
 * ************************************* */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = "INSERT INTO favorite (account_id, inv_id) VALUES ($1, $2) ON CONFLICT (account_id, inv_id) DO NOTHING RETURNING *"
        const result = await pool.query(sql, [account_id, inv_id])
    
        return result.rowCount > 0;
    } catch (error) {
        return error.message
    }
}

/* *************************************************
 * Remove favorite from from database favorite table
 * *********************************************** */
async function deleteFavorite(account_id, inv_id) {
    try {
        const sql = "DELETE FROM favorite WHERE account_id = $1 AND inv_id = $2 RETURNING *"
        const result = await pool.query(sql, [account_id, inv_id])
        
        return result.rowCount > 0;
    } catch (error) {
        return error.message
    }
}

/* ***************************************************
 * Return favorite inventory data from account_id
 * ************************************************* */
async function getFavoritesByAccount(account_id) {
    try {
        const sql = "SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_thumbnail, i.inv_price FROM favorite AS f JOIN inventory AS i ON f.inv_id = i.inv_id WHERE f.account_id = $1;"
        const result = await pool.query(sql, [account_id])

        return result.rows;
    } catch (error) {
        return error.message
    }
}

/* ******************************
 * Check for existing favorite
 * **************************** */
async function checkFavorite(account_id, inv_id) {
    try {
        let favorite;

        const sql = "SELECT * FROM favorite WHERE account_id = $1 AND inv_id = $2"
        favorite = await pool.query(sql, [account_id, inv_id])

        return favorite.rowCount > 0;
    } catch (error) {
        return error.message
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountDetailsById, updateAccount, changePassword, addFavorite, deleteFavorite, getFavoritesByAccount, checkFavorite }