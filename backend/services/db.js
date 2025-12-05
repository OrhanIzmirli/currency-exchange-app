const { Sequelize } = require('sequelize');

// Veritabanına SQLite üzerinden bağlan
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/../database.sqlite' // doğru yolu belirtiyoruz
});

module.exports = sequelize;
