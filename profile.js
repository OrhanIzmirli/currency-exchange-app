// profile.js

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const cb = document.getElementById('theme-checkbox');
  const mt = document.getElementById('mode-text');

  if (cb && mt) {
    cb.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');
      mt.textContent = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
    });
  }

  // 🔒 Log Out button
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      alert("You have been logged out.");
      window.location.href = 'login.html';
    });
  }

  // Load user data
  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();

      const fullName = document.getElementById('fullName');
      if (fullName) fullName.value = data.name || '';

      const email = document.getElementById('email');
      if (email) email.value = data.email || '';

      const phone = document.getElementById('phone');
      if (phone) phone.value = data.phone || '';

      const country = document.getElementById('country');
      if (country) country.value = data.country || 'US';

      selectedAvatar = data.avatar || '';

      if (data.avatar) {
        const preview = document.getElementById('avatar-preview');
        if (preview) {
          preview.src = `images/${data.avatar}`;
          preview.style.display = 'inline-block';
        }
      }
    } else {
      console.warn("Failed to load user data.");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }

  // Optional style tweaks
  document.querySelectorAll('.feature-card').forEach(card => {
    card.style.maxWidth = '800px';
    card.style.margin = '0 auto';
  });
});

let selectedAvatar = "";

function selectAvatar(filename) {
  selectedAvatar = filename;

  document.querySelectorAll('.avatar-option').forEach(img => img.classList.remove('selected'));
  document.querySelectorAll('.avatar-option').forEach(img => {
    if (img.src.includes(filename)) {
      img.classList.add('selected');
    }
  });

  const preview = document.getElementById('avatar-preview');
  if (preview) {
    preview.src = `images/${filename}`;
    preview.style.display = 'inline-block';
  }

  // ✅ Seçilen avatarı otomatik olarak kaydet
  const token = localStorage.getItem('token');
  fetch('/api/user/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ avatar: filename })
  })
    .then(res => res.json())
    .then(result => {
      console.log("Avatar kaydedildi:", result.message);
    })
    .catch(err => console.error("Avatar güncelleme hatası:", err));

  closeModal();
}

function openModal() {
  document.getElementById('avatarModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('avatarModal').style.display = 'none';
}

function saveProfile() {
  const token = localStorage.getItem('token');
  const data = {
    name: document.getElementById('fullName')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    country: document.getElementById('country')?.value || '',
    avatar: selectedAvatar
  };

  fetch('/api/user/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => alert(result.message))
    .catch(err => console.error('Profile update error:', err));
}

function changePassword() {
  const oldPass = document.getElementById('oldPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const token = localStorage.getItem('token');

  fetch('/api/user/update-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => console.error('Password update error:', err));
}

function deleteProfile() {
  const token = localStorage.getItem('token');
  if (confirm("Are you sure you want to delete your profile?")) {
    fetch('/api/user/delete-account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          alert("Your account has been deleted.");
          localStorage.removeItem('token');
          window.location.href = '/signup.html';
        } else {
          return res.json().then(data => alert(data.message || 'Delete failed.'));
        }
      })
      .catch(err => console.error('Delete error:', err));
  }
}
