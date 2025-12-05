const express = require('express');
const router = express.Router();
const { updatePassword, deleteAccount, updateProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management (update password, delete account)
 */

// PUT /api/user/update-password → şifre güncelle
/**
 * @swagger
 * /api/user/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing fields or new password too short
 *       401:
 *         description: Old password incorrect
 */
router.put('/update-password', verifyToken, updatePassword);

// DELETE /api/user/delete-account → kullanıcı hesabını sil
/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Delete the currently logged-in user's account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.delete('/delete-account', verifyToken, deleteAccount);
router.put('/update-profile', verifyToken, updateProfile); // 🔒 Swagger dışında

module.exports = router;
