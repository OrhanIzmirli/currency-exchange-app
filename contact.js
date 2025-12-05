document.addEventListener('DOMContentLoaded', () => {
    // —— Theme toggle ——
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
        localStorage.setItem('mode','light');
      } else {
        document.body.classList.remove('light-mode');
        mt.textContent = 'Dark';
        localStorage.setItem('mode','dark');
      }
    });
  
    // —— Form validation & fake submit ——
    const form = document.getElementById('contact-form');
    const btn  = document.getElementById('send-btn');
    const spinner = document.getElementById('send-spinner');
    form.addEventListener('submit', e => {
      e.preventDefault();
      ['name','email','subject','message'].forEach(id => {
        document.getElementById(`error-${id}`).textContent = '';
      });
      let valid = true;
      if (!form.name.value.trim()) {
        document.getElementById('error-name').textContent = 'Please enter your name.'; valid = false;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email.value.trim())) {
        document.getElementById('error-email').textContent = 'Invalid email address.'; valid = false;
      }
      if (!form.subject.value.trim()) {
        document.getElementById('error-subject').textContent = 'Subject cannot be empty.'; valid = false;
      }
      if (!form.message.value.trim()) {
        document.getElementById('error-message').textContent = 'Message cannot be empty.'; valid = false;
      }
      if (!valid) return;
      btn.classList.add('loading'); btn.disabled = true;
      setTimeout(() => {
        alert('Message sent! We will get back to you shortly.');
        btn.classList.remove('loading'); btn.disabled = false; form.reset();
      }, 1500);
    });
  
    // —— Chatbot modal open/close ——
    const openBtn  = document.getElementById('chatbot-open-btn');
    const modal    = document.getElementById('chatbot-modal');
    const closeBtn = document.getElementById('chatbot-close-btn');
  
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  
    // —— Chatbot container ready ——
    console.log('Chatbot container ready:', document.getElementById('chatbot-container'));
    // Buraya gerçek API init kodunuzu ekleyin.
  });
  