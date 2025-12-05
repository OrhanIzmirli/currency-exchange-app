// Fetch exchange rate data from NBP API
const axios = require('axios');

const getExchangeRates = async () => {
  try {
    const response = await axios.get('https://api.nbp.pl/api/exchangerates/tables/A?format=json');
    const data = response.data[0];

    const filteredRates = {};
    data.rates.forEach(rate => {
      if (['USD', 'EUR', 'GBP', 'TRY'].includes(rate.code)) {
        filteredRates[rate.code] = rate.mid;
      }
    });

    return {
      base: 'PLN',
      effectiveDate: data.effectiveDate,
      rates: filteredRates,
    };
  } catch (error) {
    console.error('NBP API error:', error.message);

    // ✅ 503 - Service unavailable
    const err = new Error('Currency service is temporarily unavailable.');
    err.status = 503;
    throw err;
  }
};

module.exports = { getExchangeRates };
