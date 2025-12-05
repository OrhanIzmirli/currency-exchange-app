const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

// GET: Belirli kullanıcıya ait dövizleri getir
router.get('/wallet', async (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (!userId) {
    return res.status(400).json({ error: 'user_id gerekli' });
  }

  try {
    const results = await Wallet.findAll({
      where: { user_id: userId },
      attributes: ['currency', 'amount']
    });
    res.json(results);
  } catch (error) {
    console.error('Cüzdan verisi alınamadı:', error);
    res.status(500).json({ error: 'Veri alınamadı' });
  }
});

// POST: Yeni döviz ekle veya varsa güncelle
router.post('/wallet', async (req, res) => {
  const { currency, amount, user_id } = req.body;

  if (!currency || isNaN(amount) || !user_id) {
    return res.status(400).json({ error: 'currency, amount ve user_id gerekli.' });
  }

  try {
    const existing = await Wallet.findOne({
      where: { user_id, currency }
    });

    if (existing) {
      existing.amount += parseFloat(amount);
      await existing.save();
      return res.status(200).json(existing);
    }

    const newEntry = await Wallet.create({ currency, amount, user_id });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Cüzdan verisi eklenemedi:', error);
    res.status(500).json({ error: 'Veri eklenemedi' });
  }
});

module.exports = router;
