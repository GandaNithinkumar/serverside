const pool = require("./models/db");

async function initDatabase() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected successfully.");

    // Create 'users' table
    console.log("Creating 'users' table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create 'products' table
    console.log("Creating 'products' table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully.");
    client.release();
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
}

initDatabase();
