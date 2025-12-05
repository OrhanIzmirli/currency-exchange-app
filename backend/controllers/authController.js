const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // 👈 EKLE: Şifreleme kütüphanesi
const { User, sequelize } = require('../models/User'); // Sequelize model and connection

// Synchronize database tables
sequelize.sync();

const register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(422).json({ message: 'Username and password are required.' });
  }

  if (password.length < 8) {
    return res.status(422).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // ✨ GÜNCELLEME: Şifreyi Hash'le (Güvenlik)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ username, password: hashedPassword, email }); // Hashlenmiş şifreyi kaydet

    res.status(201).json({ message: 'User registered successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed.' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. GÜNCELLEME: Sadece username ile ara (Şifre hashlendiği için şifreyle aranamaz)
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. GÜNCELLEME: Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(password, user.password); // Girilen şifre ile hash'i karşılaştır

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' }); // Eşleşme yoksa hata ver
    }

    // Şifre doğru, token oluştur
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed.' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
        username: user.username,
        id: user.id,
        email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user data.' });
  }
};

module.exports = { register, login, me };