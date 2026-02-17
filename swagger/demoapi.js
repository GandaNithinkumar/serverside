const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nithin
 *               email:
 *                 type: string
 *                 example: nithin@gmail.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, passwordHash]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

module.exports = router;
