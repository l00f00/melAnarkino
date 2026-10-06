// Adapted from the owner's inline devLink game on imlphotographer.com/about/.
// No elements are removed: Escape restores every hit and cleans up the game.
(() => {
  const trigger = document.querySelector('#year');
  if (!trigger) return;
  let hoverTimer, active = false, layer, ship, hud, score = 0;
  const hits = new Set();
  let finishing = false, finaleTimer;
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
    finishing = false;
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
    if (!active || finishing) return;
    const x = ship.getBoundingClientRect().left + 20;
    const shipTop = ship.getBoundingClientRect().top;
    const laser = document.createElement('div');
    laser.className = 'arcade-laser';
    laser.style.left = x + 'px';
    laser.style.bottom = (innerHeight - shipTop) + 'px';
    layer.append(laser);
    setTimeout(() => laser.remove(), 120);
    let target = null;
    for (let y = shipTop - 4; y > 0; y -= 4) {
      const node = document.elementFromPoint(x, y);
      if (!node || node.closest('.arcade-layer,.site-footer,.site-header,[hidden],.visually-hidden,.arcade-hit')) continue;
      target = node.closest('img,picture,video,iframe,svg,.film-preview,.product-visual,h1,h2,h3,h4,h5,h6,p,li,td,th,span,strong,em,a,button,article,figure,section,div');
      if (!target || !target.closest('main') || target.matches('main') || hits.has(target)) { target = null; continue; }
      break;
    }
    // Even a missed shot charges the finale, so short pages can reach 666 too.
    let points = 6;
    if (target) {
      const media = target.matches('img,picture,video,iframe,svg,.film-preview,.product-visual');
      const heading = target.matches('h1,h2,h3,h4,h5,h6') || target.closest('h1,h2,h3,h4,h5,h6');
      points = media ? 50 : heading ? 30 : target.matches('article,figure,section,div') ? 100 : 10;
      const rect = target.getBoundingClientRect();
      burst(Math.max(24, Math.min(innerWidth - 24, rect.left + rect.width / 2)), Math.max(30, rect.top + Math.min(rect.height / 2, 80)), '+' + points);
      target.classList.add('arcade-hit');
      hits.add(target);
    }
    score = Math.min(666, score + points);
    hud.textContent = 'ANARKINO ARCADE · ' + score + '/666 · +' + points + ' · Esci / Esc: ripristina';
    if (score === 666) kaboom();
  }
  function burst(x, y, text) {
    const effect = document.createElement('div');
    effect.className = 'arcade-pop';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.textContent = text;
    layer.append(effect);
    setTimeout(() => effect.remove(), 650);
  }
  function kaboom() {
    finishing = true;
    axis = 0;
    cancelAnimationFrame(frame);
    layer.classList.add('arcade-finale');
    document.body.classList.add('arcade-quake');
    const explosion = document.createElement('div');
    explosion.className = 'arcade-kaboom';
    explosion.setAttribute('role', 'alert');
    const points = document.createElement('span');
    points.textContent = 'GAME OVER';
    const over = document.createElement('span');
    over.textContent = 'congrats';
    const boom = document.createElement('strong');
    boom.textContent = 'developed by Melania Filidei / l00f00';
    explosion.append(points, over, boom);
    layer.append(explosion);
    finaleTimer = setTimeout(stop, 2600);
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
    clearTimeout(finaleTimer);
    document.body.classList.remove('arcade-quake');
    finishing = false;
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
