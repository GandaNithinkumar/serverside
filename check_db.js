const pool = require("./models/db");

async function checkDatabase() {
    try {
        console.log("1. Connecting...");
        const client = await pool.connect();
        console.log("2. Connected.");

        // Check users table
        try {
            const userCount = await client.query("SELECT COUNT(*) FROM users");
            console.log(`3. Users table exists. Count: ${userCount.rows[0].count}`);
        } catch (e) {
            console.log("3. Users table DOES NOT exist or error:", e.message);
        }

        // Check products table
        try {
            const productCount = await client.query("SELECT COUNT(*) FROM products");
            console.log(`4. Products table exists. Count: ${productCount.rows[0].count}`);
        } catch (e) {
            console.log("4. Products table DOES NOT exist or error:", e.message);
        }

        client.release();
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

checkDatabase();
