// Catalogo condiviso: primi sei prodotti in homepage, catalogo completo nello shop.
// Per gli acquisti Stripe inserire paymentLink, price, image e available: true.
// Configurare taglie e spedizioni su Stripe. Non inserire chiavi API o segreti.
window.anarkinoProducts = [
  {
    "id": "felpa-bianca",
    "name": "Felpa bianca Anarkino",
    "type": "hoodie",
    "description": "Anarkino da portare con te, in bianco.",
    "image": "assets/felpabianca.jpg",
    "price": "€ 37",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "felpa-nera",
    "name": "Felpa nera Anarkino",
    "type": "hoodie",
    "description": "Anarkino da portare con te, in nero.",
    "image": "assets/felpanera.jpg",
    "price": "€ 37",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "maglietta-nera",
    "name": "Maglietta nera Anarkino",
    "type": "shirt",
    "description": "Un piccolo pezzo del nostro mondo, da indossare ogni giorno.",
    "image": "assets/magliettanera.jpg",
    "price": "€ 21",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "workshop-horror",
    "name": "Le forme della paura",
    "type": "workshop",
    "description": "Un workshop di cinema horror per realizzare un cortometraggio collettivo.",
    "image": "assets/horror.webp",
    "detailsLink": "workshop-horror.html",
    "price": "€ 120 a persona",
    "priceNote": "Include € 10 di tesseramento AnarKino APS.",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "workshop-cinema",
    "name": "Cinema per principianti",
    "type": "workshop",
    "description": "Dalle basi della grammatica cinematografica alla tua prima scena.",
    "image": "assets/base.webp",
    "detailsLink": "workshop-cinema.html",
    "price": "€ 120 a persona",
    "priceNote": "Include € 10 di tesseramento AnarKino APS.",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "workshop-recitazione",
    "name": "Dall’altra parte della macchina",
    "type": "workshop",
    "description": "Un corso di recitazione per registi: comunicare, ascoltare e dirigere.",
    "image": "assets/recitazione.webp",
    "detailsLink": "workshop-acting.html",
    "price": "€ 120 a persona",
    "priceNote": "Include € 10 di tesseramento AnarKino APS.",
    "paymentLink": "",
    "available": false
  },
  {
    "id": "tesseramento",
    "name": "Tesseramento AnarKino APS",
    "type": "membership",
    "description": "La tessera associativa AnarKino APS, valida per l’anno in corso.",
    "image": "assets/tesseramento.jpg",
    "price": "€ 10",
    "priceNote": "Già incluso nella quota dei workshop.",
    "paymentLink": "",
    "available": false
  }
];
