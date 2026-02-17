const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || '9392682177'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}/${process.env.DB_NAME || 'my_app'}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;
