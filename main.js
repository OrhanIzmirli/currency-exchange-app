let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const track  = document.getElementById('slider-track');
const dots   = document.querySelectorAll('.dot');
const image  = document.getElementById('dynamic-image');
const ticker = document.querySelector('.ticker-items');

const slideWidth = slides[0].getBoundingClientRect().width;
function showSlide(i) {
  currentSlide = i;
  track.style.transform = `translateX(-${i * slideWidth}px)`;
  dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
  image.style.opacity = 0;
  setTimeout(()=>{
    image.src = ['images/main.png','images/online_payment.png'][i];
    image.style.opacity = 1;
  },200);
}
function nextSlide() { showSlide((currentSlide+1)%slides.length); }
function prevSlide() { showSlide((currentSlide-1+slides.length)%slides.length); }
function setSlide(i) { showSlide(i); }

const params = new URLSearchParams(location.search);
const slideParam = parseInt(params.get('slide'));
if (!isNaN(slideParam)) showSlide(slideParam);
else showSlide(0);

const cb = document.getElementById('theme-checkbox');
const mt = document.getElementById('mode-text');
cb.addEventListener('change', ()=>{
  document.body.classList.toggle('light-mode');
  mt.textContent = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
});

async function fetchRates() {
  try {
    const codes = ['pln','usd','eur','try'];
    const data = await Promise.all(codes.map(code => {
      if(code==='pln') return Promise.resolve({code:'PLN', mid:1});
      return fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`)
        .then(r=>r.json())
        .then(j=>({code:j.code, mid:j.rates[0].mid}));
    }));
    ticker.textContent = data.map(d=>`${d.code}: ${d.mid.toFixed(2)}`).join(' • ');
  } catch {
    ticker.textContent = 'Rates unavailable';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = {
    profile: document.getElementById('btn-profile'),
    payment: document.getElementById('btn-payment'),
    exchange: document.getElementById('btn-exchange')
  };

  Object.entries(buttons).forEach(([key, btn]) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // bu kritik!
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
      } else {
        window.location.href = `${key}.html`;
      }
    });
  });

  fetchRates();
  setInterval(fetchRates, 60000);
});
