// Parenting Style Snapshot
(function () {
  var LABELS = ['Rarely', 'Sometimes', 'Often', 'Always'];
  var ITEMS = [
    { id: 'w1', dim: 'w', tag: 'Warmth', text: 'I set aside time to talk with my child about their day or feelings.' },
    { id: 's1', dim: 's', tag: 'Structure', text: 'I explain the reason behind a rule when I set it.' },
    { id: 'w2', dim: 'w', tag: 'Warmth', text: 'I notice my child’s effort, not just results.' },
    { id: 's2', dim: 's', tag: 'Structure', text: 'Our house rules stay the same even when I’m stressed or busy.' },
    { id: 'w3', dim: 'w', tag: 'Warmth', text: 'My child comes to me when something is bothering them.' },
    { id: 's3', dim: 's', tag: 'Structure', text: 'I respond to the same misbehaviour the same way each time.' }
  ];
  var RESULTS = {
    authoritative: {
      title: 'Warm and steady',
      body: 'You pair connection with clear, explained rules — the balance research links most to children’s wellbeing.',
      next: 'After your next disagreement, go back within a day and talk it through together.'
    },
    authoritarian: {
      title: 'Clear rules, room for more warmth',
      body: 'Your child knows the rules. A little more listening helps them bring you problems without fear.',
      next: 'Once a day, ask about their day and just listen for ten minutes — no advice.'
    },
    permissive: {
      title: 'Lots of warmth, rules that bend',
      body: 'Your closeness is a real strength. Fewer, clearer rules — kept consistently — build on it.',
      next: 'Agree three house rules together, and explain why each one matters.'
    },
    uninvolved: {
      title: 'Stretched thin',
      body: 'Long hours leave many parents with little left. That’s an overloaded parent, not a bad one.',
      next: 'Protect one ten-minute slot each day that belongs only to your child.'
    }
  };

  var answers = {};
  var wrap = document.getElementById('questions');

  ITEMS.forEach(function (it) {
    var fs = document.createElement('fieldset');
    fs.className = 'q';
    var lg = document.createElement('legend');
    lg.textContent = it.tag;
    var q = document.createElement('div');
    q.className = 'text';
    q.textContent = it.text;
    var opts = document.createElement('div');
    opts.className = 'opts';
    LABELS.forEach(function (label, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.textContent = label;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        answers[it.id] = i;
        Array.prototype.forEach.call(opts.children, function (c, j) {
          c.setAttribute('aria-pressed', j === i ? 'true' : 'false');
        });
        update();
      });
      opts.appendChild(b);
    });
    fs.appendChild(lg);
    fs.appendChild(q);
    fs.appendChild(opts);
    wrap.appendChild(fs);
  });

  function update() {
    var w = 0, s = 0, n = 0;
    ITEMS.forEach(function (it) {
      var v = answers[it.id];
      if (v === undefined) return;
      n++;
      if (it.dim === 'w') w += v; else s += v;
    });
    document.getElementById('count').textContent = n;
    var done = n === ITEMS.length;
    var res = document.getElementById('result');
    document.getElementById('pending').hidden = done;
    if (!done) { res.hidden = true; return; }
    var hiW = w >= 6, hiS = s >= 6;
    var key = hiW && hiS ? 'authoritative' : (!hiW && hiS ? 'authoritarian' : (hiW ? 'permissive' : 'uninvolved'));
    var r = RESULTS[key];
    document.getElementById('r-title').textContent = r.title;
    document.getElementById('r-body').textContent = r.body;
    document.getElementById('r-next').textContent = r.next;
    document.getElementById('r-w').textContent = w + '/9';
    document.getElementById('r-s').textContent = s + '/9';
    Array.prototype.forEach.call(document.querySelectorAll('.quad'), function (el) {
      el.classList.toggle('active', el.getAttribute('data-key') === key);
    });
    var wasHidden = res.hidden;
    res.hidden = false;
    if (wasHidden) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('reset').addEventListener('click', function () {
    answers = {};
    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) {
      b.setAttribute('aria-pressed', 'false');
    });
    update();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
