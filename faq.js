document.addEventListener('DOMContentLoaded', () => {
    // Accordion toggle
    document.querySelectorAll('.accordion .question').forEach(btn => {
      btn.addEventListener('click', () => {
        const ans = btn.nextElementSibling;
        if (ans.style.maxHeight) {
          ans.style.maxHeight = null;
        } else {
          document.querySelectorAll('.accordion .answer')
            .forEach(a => a.style.maxHeight = null);
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  
    // Theme toggle
    const cb = document.getElementById('theme-checkbox');
    const mt = document.getElementById('mode-text');
    cb.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');
      mt.textContent = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
    });
  });
  