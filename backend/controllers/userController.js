const { User } = require('../models/User');

// ✅ Update user password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Both old and new passwords are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    // ✅ 404 - User not found
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update password.' });
  }
};

// ✅ Delete user account
const deleteAccount = async (req, res) => {
  const username = req.user.username;

  try {
    const deleted = await User.destroy({ where: { username } });

    // ✅ 404 - User not found or already deleted
    if (deleted === 0) {
      return res.status(404).json({ message: 'User not found or already deleted.' });
    }

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete account.' });
  }
};

// ✅ Update user profile information
const updateProfile = async (req, res) => {
  const username = req.user.username;
  const { name, email, phone, country, avatar } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    // ✅ 404 - User not found
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.username = name || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

module.exports = {
  updatePassword,
  deleteAccount,
  updateProfile
};
