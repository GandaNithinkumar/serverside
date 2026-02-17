const express = require("express");
const router = express.Router();
const pool = require("../models/db");

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, image]
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16
 *               price:
 *                 type: number
 *                 example: 120000
 *               image:
 *                 type: string
 *                 example: http://localhost:3000/uploads/sample.png
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/products", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    const result = await pool.query(
      "INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *",
      [name, price, image]
    );

    res.status(201).json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json(result.rows);
});

module.exports = router;
