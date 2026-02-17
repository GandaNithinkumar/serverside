require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Multer Storage Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).replace("..", ".");
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

const PORT = process.env.PORT || 3000;

// Upload API for images
app.post("/upload", upload.single("image"), (req, res) => {
  const host = req.get("host");
  const protocol = req.protocol;
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My App API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "/",
        description: "Current Host"
      }
    ],
  },
  apis: ["./swagger/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const userRoutes = require("./swagger/demoapi");
app.use("/", userRoutes);

const productRoutes = require("./swagger/products");
app.use("/", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Node + PostgreSQL API is working!");
});

const pool = require("./models/db");

async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log("Connected to database for initialization.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables verified/created.");
    client.release();
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

// Run Server
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
