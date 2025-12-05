document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  // Theme toggle
  const cb = document.getElementById('theme-checkbox');
  const mt = document.getElementById('mode-text');
  if (localStorage.getItem('mode') === 'light') {
    document.body.classList.add('light-mode');
    cb.checked = true;
    mt.textContent = 'Light';
  }
  cb.addEventListener('change', () => {
    if (cb.checked) {
      document.body.classList.add('light-mode');
      mt.textContent = 'Light';
      localStorage.setItem('mode', 'light');
    } else {
      document.body.classList.remove('light-mode');
      mt.textContent = 'Dark';
      localStorage.setItem('mode', 'dark');
    }
  });

  const stripe = Stripe('pk_test_51RScjbPubGkspsDcKxCqDL3q5vHxl5TiHAmOdgUqzY56yFCU9n7YvnkMplDPAm4S0TnxKAHNY8a7UAOR82JtkUKc00PtuVWmd0');
  const elements = stripe.elements({ locale: 'en' });
  const card = elements.create('card');
  card.mount('#card-element');

  const form = document.getElementById('payment-form');
  const btn = document.getElementById('pay-btn');
  const spinner = document.getElementById('pay-spinner');

  // ✅ Kullanıcının user_id'sini localStorage'dan al
  const userId = parseInt(localStorage.getItem('user_id'));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('card-error').textContent = '';
    document.getElementById('error-amount').textContent = '';

    const cardholder = form['cardholder'].value.trim();
    const amount = parseFloat(form['amount'].value);
    const currency = form['currency'].value;
    const token = localStorage.getItem('token');

    if (!cardholder) {
      document.getElementById('card-error').textContent = 'Enter cardholder name.';
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      document.getElementById('error-amount').textContent = 'Enter a valid amount.';
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');

      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: cardholder }
        }
      });

      if (result.error) {
        document.getElementById('card-error').textContent = result.error.message;
      } else {
        alert('✅ Payment successful!');

        // ✅ Ödeme başarılı → Cüzdana ekle
        await fetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currency, amount, user_id: userId })
        });

        form.reset();
        card.clear();
        window.location.reload();
      }

    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ✅ Cüzdan görünümünü sadece bu kullanıcıya göre getir
  try {
    const response = await fetch(`/api/wallet?user_id=${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    const walletList = document.getElementById('wallet-list');
    walletList.innerHTML = '';

    if (data.length === 0) {
      walletList.innerHTML = '<li>No currencies available</li>';
    } else {
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.currency}: ${item.amount}`;
        walletList.appendChild(li);
      });
    }
  } catch (err) {
    const walletList = document.getElementById('wallet-list');
    if (walletList) walletList.innerHTML = '<li>Hata oluştu</li>';
  }
});
