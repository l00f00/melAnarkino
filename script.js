const navigation = document.querySelector('.navigation');
const closeMenu = (restoreFocus = false) => {
  if (!navigation?.open) return;
  navigation.open = false;
  if (restoreFocus) navigation.querySelector('summary').focus();
};
navigation?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => closeMenu(true));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu(true);
});
document.addEventListener('click', event => {
  if (navigation && !navigation.contains(event.target)) closeMenu();
});
navigation?.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget)) closeMenu();
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

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
  (grid.dataset.catalog === 'preview' ? products.slice(0, 6) : products).forEach(product => {
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
    } else if (product.detailsLink) {
      const link = element('a', 'button button-light', 'Scopri il workshop ↗');
      link.href = product.detailsLink;
      link.setAttribute('aria-label', `Scopri il workshop ${product.name}`);
      info.append(link);
    } else {
      const button = element('button', 'button product-unavailable', 'Prossimamente');
      button.disabled = true;
      info.append(button);
    }
    card.append(visual, info);
    grid.append(card);
  });
});
