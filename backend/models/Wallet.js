const { DataTypes } = require('sequelize');
const sequelize = require('../services/db'); // ← senin Sequelize bağlantın

const Wallet = sequelize.define('Wallet', {
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // istersen false yap
  }
});

module.exports = Wallet;
