document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 🔄 CÜZDAN verisini çek
  const userId = parseInt(localStorage.getItem('user_id'));
  const walletList = document.getElementById('wallet-list');

  if (walletList && userId) {
    fetch(`/api/wallet?user_id=${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
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
      })
      .catch(err => {
        walletList.innerHTML = '<li>Hata oluştu</li>';
        console.error('Wallet fetch error:', err);
      });
  }
});

// Helper to update theme label
function updateThemeLabel() {
  const label = document.getElementById('theme-label');
  if (document.body.classList.contains('light-mode')) {
    label.textContent = 'Light';
  } else {
    label.textContent = 'Dark';
  }
}

// Tema toggle logic
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', toggle.checked);
  updateThemeLabel();
});
updateThemeLabel();

// 🔄 Canlı kurlar buraya yüklenecek
let liveRates = {};

// Döviz kurlarını sayfa yüklendiğinde çek
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const rateList = document.getElementById('rate-list');

  if (!rateList || !token) return;

  try {
    const response = await fetch('/api/exchange', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(`Exchange rate fetch error: ${data.message}`);
      return;
    }

    const data = await response.json();
    const rates = data.rates;

    // 🔐 canlı kurlar burada tutulacak
    liveRates = rates;

    // PLN oranını manuel olarak dahil et
    liveRates['PLN'] = 1.0;

    // Kullanıcıya 1 PLN = ? şeklinde oranları göster
    Object.entries(liveRates).forEach(([code, mid]) => {
      if (code !== 'PLN' && mid !== 0) {
        const li = document.createElement('li');
        const invertedRate = (1 / mid).toFixed(4);
        li.textContent = `1 PLN → ${invertedRate} ${code}`;
        rateList.appendChild(li);
      }
    });

  } catch (err) {
    console.error('Exchange rate fetch error:', err);
  }
});

// Form submit handler → doğru oranla çeviri
document.getElementById('exchange-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('convert-btn');
    btn.classList.add('loading');

    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const amt = parseFloat(document.getElementById('amount').value);

    if (from === to) {
      document.getElementById('result').innerText = `${amt} ${from} = ${amt.toFixed(2)} ${to}`;
      btn.classList.remove('loading');
      return;
    }

    const fromRate = liveRates[from];
    const toRate = liveRates[to];

    if (!fromRate || !toRate) {
      document.getElementById('result').innerText = `Conversion rate not available.`;
      btn.classList.remove('loading');
      return;
    }

    // ✔️ Doğru dönüşüm: önce PLN'ye çevir, sonra hedefe
    const plnAmount = amt * fromRate;
    const result = (plnAmount / toRate).toFixed(2);

    document.getElementById('result').innerText = `${amt} ${from} = ${result} ${to}`;
    btn.classList.remove('loading');
  });
