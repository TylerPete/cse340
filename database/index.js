const { Pool } = require("pg")
require("dotenv").config()
/* ******************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * ****************** */
let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params) {
            try {
                console.log("TEXT TYPE:", typeof text)
                console.log("TEXT VALUE:", text)
                console.log("PARAMS TYPE:", typeof params)
                console.log("PARAMS VALUE:", params)                

                let res
                
                if (Array.isArray(params)) {
                    res = await pool.query(text, params)
                } else {
                    res = await pool.query(text)
                }

                console.log("executed query", { text })
                return res
            } catch (error) {
                console.error("error in query", { text, params })
                throw error
            }
        },
    } 
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}