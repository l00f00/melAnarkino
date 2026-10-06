// Catalogo condiviso tra homepage e shop. Nessuna chiave API deve essere inserita qui.
// Aggiungere altri prodotti all'array; compariranno nella pagina shop.
// Per attivare un acquisto: inserire il Payment Link Stripe, prezzo, immagine e available: true.
// Gestire varianti/taglie, spedizioni e disponibilità nella pagina di pagamento Stripe.
window.anarkinoProducts = [
  {
    id: 'felpa', name: 'Felpa Anarkino', type: 'hoodie',
    description: 'Anarkino da portare con te, anche quando si spengono le luci in sala.',
    image: '', price: '', paymentLink: '', available: false
  },
  {
    id: 'maglietta', name: 'Maglietta Anarkino', type: 'shirt',
    description: 'Un piccolo pezzo del nostro mondo, da indossare ogni giorno.',
    image: '', price: '', paymentLink: '', available: false
  }
];
