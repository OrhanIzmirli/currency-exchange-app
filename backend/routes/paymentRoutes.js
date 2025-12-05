const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Stripe payment integration routes
 */

// POST /api/payment/create-payment-intent → Stripe ödeme oluştur
/**
 * @swagger
 * /api/payment/create-payment-intent:
 *   post:
 *     summary: Create a Stripe payment intent
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 5000
 *               currency:
 *                 type: string
 *                 example: usd
 *     responses:
 *       200:
 *         description: Client secret returned for payment
 *       400:
 *         description: Missing or invalid input
 *       401:
 *         description: Unauthorized - token missing
 */
router.post('/create-payment-intent', verifyToken, createPaymentIntent);

module.exports = router;
