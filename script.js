const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
