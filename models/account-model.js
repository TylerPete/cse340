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

//updateAccount
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

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountDetailsById, updateAccount }