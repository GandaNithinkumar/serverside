const pool = require("../models/db");

async function runMigration() {
    try {
        console.log("Running migration: Adding password_hash to users table...");
        const client = await pool.connect();

        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);

        console.log("Migration completed successfully.");
        client.release();
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
    }
}

runMigration();
