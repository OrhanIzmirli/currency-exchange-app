const { getExchangeRates } = require('../services/nbpService');

const exchangeRates = async (req, res) => {
  try {
    const rates = await getExchangeRates();

    // ✅ 404 - If rates data is missing or empty
    if (!rates || Object.keys(rates.rates).length === 0) {
      return res.status(404).json({ message: 'Exchange rates not found.' });
    }

    res.status(200).json(rates);
  } catch (err) {
    console.error(err);

    // ✅ 503 - If external API fails, status is set in the thrown error
    res.status(err.status || 500).json({
      message: err.message || 'Failed to fetch exchange rates.'
    });
  }
};

module.exports = { exchangeRates };
