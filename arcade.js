// Adapted from the owner's inline devLink game on imlphotographer.com/about/.
// No elements are removed: Escape restores every hit and cleans up the game.
(() => {
  const trigger = document.querySelector('#year');
  if (!trigger) return;
  let hoverTimer, active = false, layer, ship, hud, score = 0;
  const hits = new Set();
  const cancel = () => { clearTimeout(hoverTimer); };
  const arm = () => { cancel(); if (!active) hoverTimer = setTimeout(start, 5000); };
  trigger.addEventListener('mouseenter', arm);
  trigger.addEventListener('mouseleave', cancel);
  trigger.addEventListener('focusin', arm);
  trigger.addEventListener('focusout', cancel);
  window.addEventListener('blur', () => { cancel(); if (active) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancel(); if (active) stop(); } });

  function start() {
    if (active) return;
    active = true;
    score = 0;
    layer = document.createElement('div');
    layer.className = 'arcade-layer';
    hud = document.createElement('div');
    hud.className = 'arcade-hud';
    hud.setAttribute('role', 'status');
    hud.textContent = 'ANARKINO ARCADE · Mouse: muovi · Clic / Spazio: spara · Esc: ripristina';
    ship = document.createElement('div');
    ship.className = 'arcade-ship';
    ship.setAttribute('aria-hidden', 'true');
    ship.style.left = Math.max(0, innerWidth / 2 - 20) + 'px';
    layer.append(hud, ship);
    document.body.append(layer);
    document.addEventListener('pointermove', move);
    document.addEventListener('click', shoot, true);
    document.addEventListener('keydown', keyboard, true);
  }
  function move(event) {
    ship.style.left = Math.max(0, Math.min(innerWidth - 40, event.clientX - 20)) + 'px';
  }
  function keyboard(event) {
    if (event.key === 'Escape') { event.preventDefault(); stop(); }
    else if (event.code === 'Space' && !event.repeat && !event.target.closest('input,textarea,select,[contenteditable]')) {
      event.preventDefault(); fire();
    }
  }
  function shoot(event) {
    // Keep the developer link, footer and navigation usable even while playing.
    if (event.target.closest('.site-footer,.site-header,input,textarea,select,[contenteditable]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fire();
  }
  function fire() {
    const x = ship.getBoundingClientRect().left + 20;
    const laser = document.createElement('div');
    laser.className = 'arcade-laser';
    laser.style.left = x + 'px';
    layer.append(laser);
    setTimeout(() => laser.remove(), 120);
    for (let y = innerHeight - 80; y > 0; y -= 4) {
      const node = document.elementFromPoint(x, y);
      if (!node || node.closest('.arcade-layer,.site-footer,.site-header,[hidden],.visually-hidden')) continue;
      const target = node.closest('p,h1,h2,h3,h4,li,td,th,span,strong,em,a');
      if (!target || !target.closest('main') || !target.textContent.trim() || target.querySelector('img,iframe,video,button,input')) continue;
      if (hits.has(target)) continue;
      target.classList.add('arcade-hit');
      hits.add(target);
      score += 10;
      hud.textContent = `ANARKINO ARCADE · ${score} punti · Esc: ripristina`;
      break;
    }
  }
  function stop() {
    cancel();
    active = false;
    document.removeEventListener('pointermove', move);
    document.removeEventListener('click', shoot, true);
    document.removeEventListener('keydown', keyboard, true);
    hits.forEach(node => node.classList.remove('arcade-hit'));
    hits.clear();
    layer?.remove();
  }
})();
