// Adapted from the owner's inline devLink game on imlphotographer.com/about/.
// No elements are removed: Escape restores every hit and cleans up the game.
(() => {
  const trigger = document.querySelector('#year');
  if (!trigger) return;
  let hoverTimer, active = false, layer, ship, hud, score = 0;
  const hits = new Set();
  let touchMode = false, press, suppressClickUntil = 0, frame, axis = 0, lastFrame = 0;
  trigger.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || active) return;
    cancel();
    press = { id: event.pointerId, x: event.clientX, y: event.clientY };
    hoverTimer = setTimeout(() => {
      if (!press) return;
      touchMode = true;
      suppressClickUntil = Date.now() + 2000;
      start();
    }, 1500);
  });
  trigger.addEventListener('pointermove', event => {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 12) endPress();
  });
  function endPress() {
    if (press && active) suppressClickUntil = Date.now() + 800;
    press = null;
    cancel();
  }
  trigger.addEventListener('pointerup', endPress);
  trigger.addEventListener('pointercancel', endPress);
  trigger.addEventListener('pointerleave', endPress);
  trigger.addEventListener('contextmenu', event => event.preventDefault());
  trigger.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  const cancel = () => { clearTimeout(hoverTimer); };
  const arm = () => { cancel(); if (!active) hoverTimer = setTimeout(start, 5000); };
  trigger.addEventListener('mouseenter', () => { if (!press && !matchMedia('(hover: none)').matches) arm(); });
  trigger.addEventListener('mouseleave', cancel);
  trigger.addEventListener('focusin', () => { if (!press && !matchMedia('(hover: none)').matches) arm(); });
  trigger.addEventListener('focusout', cancel);
  window.addEventListener('blur', () => { cancel(); if (active) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancel(); if (active) stop(); } });

  function start() {
    if (active) return;
    active = true;
    score = 0;
    layer = document.createElement('div');
    touchMode = touchMode || matchMedia('(hover: none)').matches;
    layer.className = 'arcade-layer' + (touchMode ? ' arcade-touch' : '');
    hud = document.createElement('div');
    hud.className = 'arcade-hud';
    hud.setAttribute('role', 'status');
    hud.textContent = touchMode ? 'ANARKINO ARCADE · Joystick: muovi · Spara · Esci: ripristina' : 'ANARKINO ARCADE · Mouse: muovi · Clic / Spazio: spara · Esc: ripristina';
    ship = document.createElement('div');
    ship.className = 'arcade-ship';
    ship.setAttribute('aria-hidden', 'true');
    ship.style.left = Math.max(0, innerWidth / 2 - 20) + 'px';
    layer.append(hud, ship);
    document.body.append(layer);
    if (touchMode) addControls();
    document.addEventListener('pointermove', move);
    document.addEventListener('click', shoot, true);
    document.addEventListener('keydown', keyboard, true);
  }
  function move(event) {
    if (touchMode || event.pointerType === 'touch') return;
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
    if (touchMode || event.target.closest('.arcade-layer,.site-footer,.site-header,input,textarea,select,[contenteditable]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fire();
  }
  function fire() {
    if (!active) return;
    const x = ship.getBoundingClientRect().left + 20;
    const shipTop = ship.getBoundingClientRect().top;
    const laser = document.createElement('div');
    laser.className = 'arcade-laser';
    laser.style.left = x + 'px';
    laser.style.bottom = (innerHeight - shipTop) + 'px';
    layer.append(laser);
    setTimeout(() => laser.remove(), 120);
    for (let y = shipTop - 4; y > 0; y -= 4) {
      const node = document.elementFromPoint(x, y);
      if (!node || node.closest('.arcade-layer,.site-footer,.site-header,[hidden],.visually-hidden')) continue;
      const target = node.closest('p,h1,h2,h3,h4,li,td,th,span,strong,em,a');
      if (!target || !target.closest('main') || !target.textContent.trim() || target.querySelector('img,iframe,video,button,input')) continue;
      if (hits.has(target)) continue;
      target.classList.add('arcade-hit');
      hits.add(target);
      score += 10;
      hud.textContent = `ANARKINO ARCADE · ${score} punti · ${touchMode ? 'Esci' : 'Esc'}: ripristina`;
      break;
    }
  }
  function addControls() {
    const controls = document.createElement('div');
    controls.className = 'arcade-controls';
    const joystick = document.createElement('div');
    joystick.className = 'arcade-joystick';
    joystick.setAttribute('role', 'group');
    joystick.setAttribute('aria-label', 'Joystick: trascina a sinistra o destra');
    const knob = document.createElement('span');
    knob.className = 'arcade-knob';
    knob.setAttribute('aria-hidden', 'true');
    joystick.append(knob);
    let pointerId;
    const steer = event => {
      if (event.pointerId !== pointerId) return;
      const rect = joystick.getBoundingClientRect();
      axis = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / 35));
      knob.style.transform = 'translateX(' + axis * 28 + 'px)';
    };
    joystick.addEventListener('pointerdown', event => {
      if (pointerId !== undefined) return;
      pointerId = event.pointerId;
      joystick.setPointerCapture(pointerId);
      steer(event);
    });
    joystick.addEventListener('pointermove', steer);
    const release = event => {
      if (event.pointerId !== pointerId) return;
      pointerId = undefined; axis = 0; knob.style.transform = '';
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => joystick.addEventListener(type, release));
    const fireButton = document.createElement('button');
    fireButton.type = 'button';
    fireButton.className = 'arcade-fire';
    fireButton.textContent = 'Spara';
    fireButton.addEventListener('click', fire);
    const exit = document.createElement('button');
    exit.type = 'button';
    exit.className = 'arcade-exit';
    exit.textContent = 'Esci';
    exit.setAttribute('aria-label', 'Esci dal gioco e ripristina la pagina');
    exit.addEventListener('click', stop);
    controls.append(joystick, fireButton, exit);
    layer.append(controls);
    lastFrame = 0;
    const tick = time => {
      if (!active) return;
      const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 0;
      lastFrame = time;
      const x = parseFloat(ship.style.left) + axis * 300 * delta;
      ship.style.left = Math.max(0, Math.min(innerWidth - 40, x)) + 'px';
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    cancel();
    active = false;
    cancelAnimationFrame(frame);
    axis = 0; lastFrame = 0; press = null; touchMode = false;
    document.removeEventListener('pointermove', move);
    document.removeEventListener('click', shoot, true);
    document.removeEventListener('keydown', keyboard, true);
    hits.forEach(node => node.classList.remove('arcade-hit'));
    hits.clear();
    layer?.remove();
  }
})();
