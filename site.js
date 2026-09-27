// Waitlist form (demo: stores entries in this browser only)
document.querySelectorAll('form.waitlist').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input');
    var msg = form.querySelector('.msg');
    var value = input.value.trim();
    if (!value) return;
    try {
      var list = JSON.parse(localStorage.getItem('pa-waitlist') || '[]');
      list.push({ contact: value, at: new Date().toISOString() });
      localStorage.setItem('pa-waitlist', JSON.stringify(list));
    } catch (err) {}
    msg.textContent = 'Thank you — you’re on the waitlist. (Demo: saved in this browser only.)';
    input.value = '';
  });
});
