document.addEventListener('DOMContentLoaded', () => {
  const form     = document.getElementById('login-form');
  const userIn   = document.getElementById('username');
  const passIn   = document.getElementById('password');
  const uError   = document.getElementById('username-error');
  const pError   = document.getElementById('password-error');
  const toggle   = document.getElementById('toggle-password');
  const btn      = document.getElementById('login-btn');
  const themeCb  = document.getElementById('theme-checkbox');
  const modeText = document.getElementById('mode-text');

  toggle.addEventListener('click', () => {
    passIn.type = passIn.type === 'password' ? 'text' : 'password';
    toggle.textContent = passIn.type === 'password' ? 'Show' : 'Hide';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    uError.textContent = '';
    pError.textContent = '';

    const username = userIn.value.trim();
    const password = passIn.value;

    if (!username) {
      uError.textContent = 'Username is required.';
      return;
    }
    if (!password) {
      pError.textContent = 'Password is required.';
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          pError.textContent = 'Invalid credentials.';
        } else {
          alert(data.message || 'Login failed.');
        }
        btn.classList.remove('loading');
        btn.disabled = false;
        return;
      }

      // ✅ Login başarılı → token + user_id kaydet
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('username', data.user.username);

      window.location.href = 'choice.html';

    } catch (err) {
      console.error('Login error:', err);
      alert('Login error.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  themeCb.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
    modeText.textContent = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
  });
});
