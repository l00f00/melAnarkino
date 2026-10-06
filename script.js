const navigation = document.querySelector('.navigation');
const closeMenu = (restoreFocus = false) => {
  if (!navigation?.open) return;
  navigation.open = false;
  if (restoreFocus) navigation.querySelector('summary').focus();
};
navigation?.querySelectorAll('a').forEach(link => {
  // Keep the link visible until the browser has performed its default navigation.
  link.addEventListener('click', () => {
    setTimeout(() => closeMenu(), 0);
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu(true);
});
document.addEventListener('click', event => {
  if (navigation && !navigation.contains(event.target)) closeMenu();
});
// A touch can blur the summary without focusing the link. Do not close on blur.
// Close only when focus actually moves to another element outside the menu.
document.addEventListener('focusin', event => {
  if (navigation && !navigation.contains(event.target)) closeMenu();
});
const year = document.querySelector('#year');
if (year) {
  const currentYear = String(new Date().getFullYear());
  year.replaceChildren();
  for (const digit of currentYear) {
    if (digit === '6') {
      const credit = document.createElement('a');
      credit.href = 'https://cyberfreak.it/';
      credit.className = 'year-credit';
      credit.textContent = digit;
      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = ' — dev in collaboration l00f00/melania filidei';
      credit.append(label);
      year.append(credit);
    } else year.append(document.createTextNode(digit));
  }
}

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
};
const stripeLink = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['buy.stripe.com', 'checkout.stripe.com'].includes(url.hostname) && !url.username && !url.password;
  } catch { return false; }
};
document.querySelectorAll('[data-catalog]').forEach(grid => {
  const products = window.anarkinoProducts || [];
  (grid.dataset.catalog === 'preview' ? products.filter(product => ['felpa-bianca', 'maglietta-nera', 'tesseramento'].includes(product.id)) : products).forEach(product => {
    const card = element('article', 'product-card');
    card.id = `product-${product.id}`;
    const visual = element('div', 'product-visual');
    if (product.image) {
      const img = element('img', 'product-photo');
      img.src = product.image;
      img.alt = product.name;
      img.loading = 'lazy';
      visual.append(img);
    } else {
      const silhouette = element('div', `garment ${product.type === 'hoodie' ? 'garment-hoodie' : 'garment-shirt'}`);
      silhouette.setAttribute('aria-hidden', 'true');
      silhouette.append(element('span', '', 'ANARKINO'));
      visual.append(silhouette, element('span', 'product-placeholder', 'Immagine in arrivo'));
    }
    const info = element('div', 'product-info');
    const ready = product.available && product.price && product.image && stripeLink(product.paymentLink);
    info.append(element('p', 'eyebrow', product.type === 'workshop' ? 'Workshop' : (ready ? 'Disponibile' : 'In arrivo')), element('h3', '', product.name), element('p', 'product-description', product.description));
    if (product.price) info.append(element('p', 'product-price', product.price));
    if (product.priceNote) info.append(element('p', 'product-price-note', product.priceNote));
    if (ready) {
      const link = element('a', 'button button-light', 'Acquista su Stripe ↗');
      link.href = product.paymentLink;
      link.setAttribute('aria-label', `Acquista ${product.name} su Stripe`);
      info.append(link);
    }
    if (product.detailsLink) {
      const link = element('a', 'button button-light', 'Scopri il workshop ↗');
      link.href = product.detailsLink;
      link.setAttribute('aria-label', `Scopri il workshop ${product.name}`);
      info.append(link);
    }
    if (!ready) {
      const pending = element('div', 'product-pending');
      const button = element('button', 'button product-unavailable', 'Acquista');
      button.disabled = true;
      button.setAttribute('aria-label', 'Acquista ' + product.name + ' — Coming soon');
      pending.append(button, element('span', 'coming-soon', 'Coming soon'));
      info.append(pending);
    }
    card.append(visual, info);
    grid.append(card);
  });
});
