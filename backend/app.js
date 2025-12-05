const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../main.html'));
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const exchangeRoutes = require('./routes/exchangeRoutes');
app.use('/api/exchange', exchangeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

const walletRoutes = require('./routes/walletRoutes');
app.use('/api', walletRoutes);

// ✅ Wallet tablosunu oluşturmak için model çağrısı
const Wallet = require('./models/Wallet');
Wallet.sync(); // tablo yoksa oluşturur, varsa dokunmaz

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ❗ app.listen kaldırıldı!
module.exports = app;
