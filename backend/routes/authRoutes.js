const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes (register and login)
 */

// POST /api/auth/register → kullanıcı kaydı
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username already exists or invalid input
 */
router.post('/register', register);

// POST /api/auth/login → kullanıcı girişi
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

// GET /api/auth/me → sadece frontend için, Swagger'da gösterilmeyecek
router.get('/me', verifyToken, me);

module.exports = router;
