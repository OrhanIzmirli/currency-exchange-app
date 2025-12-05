const express = require('express');
const router = express.Router();
const { exchangeRates } = require('../controllers/exchangeController');
const verifyToken = require('../middleware/authMiddleware'); // Token kontrolü

/**
 * @swagger
 * tags:
 *   name: Exchange
 *   description: Currency exchange rate retrieval (NBP API)
 */

// GET /api/exchange → döviz kuru bilgisi al (JWT ile erişilir)
/**
 * @swagger
 * /api/exchange:
 *   get:
 *     summary: Get latest exchange rates from NBP API
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns latest exchange rates from NBP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 base: PLN
 *                 effectiveDate: "2025-05-28"
 *                 rates:
 *                   USD: 4.15
 *                   EUR: 4.37
 *                   GBP: 5.10
 *                   TRY: 0.13
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/', verifyToken, exchangeRates);

module.exports = router;
