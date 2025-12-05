// signup.js data
document.addEventListener('DOMContentLoaded', () => {
  const themeCb     = document.getElementById('theme-checkbox');
  const modeText    = document.getElementById('mode-text');
  const form        = document.getElementById('signup-form');
  const userIn      = document.getElementById('username');
  const emailIn     = document.getElementById('email');
  const passIn      = document.getElementById('password');
  const confirmIn   = document.getElementById('confirm');
  const termsCb     = document.getElementById('terms-checkbox');
  const uError      = document.getElementById('username-error');
  const eError      = document.getElementById('email-error');
  const pError      = document.getElementById('password-error');
  const cError      = document.getElementById('confirm-error');
  const tError      = document.getElementById('terms-error');
  const btn         = document.getElementById('signup-btn');
  const toast       = document.getElementById('toast');
  const termsLink   = document.getElementById('terms-link');
  const termsModal  = document.getElementById('terms-modal');
  const closeModal  = termsModal.querySelector('.close-modal');
  const togglePwd   = document.getElementById('toggle-password');
  const toggleCnf   = document.getElementById('toggle-confirm');

  // Theme toggle
  themeCb.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
    modeText.textContent = document.body.classList.contains('light-mode') ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeCb.checked = true;
    modeText.textContent = 'Light Mode';
  } else {
    document.body.classList.remove('light-mode');
    themeCb.checked = false;
    modeText.textContent = 'Dark Mode';
  }

  // Toggle password visibility
  togglePwd.addEventListener('click', () => {
    passIn.type = passIn.type === 'password' ? 'text' : 'password';
    togglePwd.textContent = passIn.type === 'password' ? 'Show' : 'Hide';
  });

  toggleCnf.addEventListener('click', () => {
    confirmIn.type = confirmIn.type === 'password' ? 'text' : 'password';
    toggleCnf.textContent = confirmIn.type === 'password' ? 'Show' : 'Hide';
  });


  // Terms modal
  termsLink.addEventListener('click', e => {
    e.preventDefault();
    termsModal.style.display = 'block';
  });
  closeModal.addEventListener('click', () => {
    termsModal.style.display = 'none';
  });
  termsModal.addEventListener('click', e => {
    if (e.target === termsModal) termsModal.style.display = 'none';
  });

  // Toast helper
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  }

  // Form submit
  form.addEventListener('submit', async e => { // 👈 GÜNCELLEME: async eklendi
    e.preventDefault();
    [uError, eError, pError, cError, tError].forEach(el => el.textContent = '');

    let valid = true;
    const username = userIn.value.trim();
    const email = emailIn.value.trim();
    const password = passIn.value;

    if (username.length < 4) {
      uError.textContent = 'Username must be at least 4 characters'; valid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      eError.textContent = 'Enter a valid email'; valid = false;
    }
    if (password.length < 8) {
      pError.textContent = 'Password must be at least 8 characters'; valid = false;
    }
    if (confirmIn.value !== password) {
      cError.textContent = 'Passwords do not match'; valid = false;
    }
    if (!termsCb.checked) {
      tError.textContent = 'You must agree to the Terms'; valid = false;
    }

    if (!valid) {
        showToast('Please fix the errors before continuing');
        return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    // API update
    try {
        const res = await fetch('/api/auth/register', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || 'Registration failed.');
            return;
        }

        // Accunt created
        showToast('Account created! Redirecting to login…');
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);

    } catch (err) {
        console.error('Registration error:', err);
        showToast('Registration failed due to network error.');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
  });
});