# Anarkino — pagina singola

Landing page statica per l'associazione culturale Anarkino, Gragnana (Carrara).

## Avvio

Aprire `index.html` direttamente nel browser. Non servono installazioni o build.

### Sviluppo condiviso con VS Code Server

1. Copiare `.env.example` in `.env` e impostare una password condivisa.
2. Avviare `docker compose up -d`.
3. Sito: `http://localhost:8088`; editor: `http://localhost:8080`.

Il servizio `code-server` monta questa cartella, quindi le modifiche fatte dall'editor sono immediatamente visibili al sito. In produzione esporre l'editor su un sottodominio separato e mantenere la password in una variabile segreta di Coolify.

## Da personalizzare

- sostituire i poster grafici con foto reali del Cinemino e dei lavori;
- sostituire titoli e descrizioni provvisorie del portfolio;
- aggiungere email e social ufficiali;
- sostituire i nomi segnaposto dei collaboratori con loghi autorizzati.

I poster e le composizioni attuali sono grafiche locali di fallback, non fotografie reali.

## Shop

`shop-config.js` contiene il catalogo condiviso tra home (felpa bianca, t-shirt nera e tesseramento) e
`shop.html` (tutti i prodotti). Per ciascun prodotto impostare:

- `id`: identificativo univoco; `name` e `description`: testi del prodotto;
- `image`: percorso della foto definitiva, ad esempio `assets/felpa.webp`;
- `price`: prezzo da mostrare, coerente con Stripe (es. `€ 35,00`);
- `paymentLink`: URL HTTPS della pagina di pagamento Stripe;
- `available`: impostare `true` solo quando il prodotto è pronto alla vendita.

Il pulsante di acquisto si attiva solo con immagine, prezzo, disponibilità e un
link su `buy.stripe.com` o `checkout.stripe.com`. Non inserire chiavi API o segreti.
Prima di attivare le vendite configurare su Stripe taglie/varianti, raccolta
indirizzo e costi di spedizione per i capi fisici, e pubblicare informazioni reali
su consegna e resi nello shop. I pagamenti e la conferma ordine sono gestiti dalla
pagina ospitata da Stripe; il sito non registra ordini e non verifica pagamenti.
Aggiungere altri oggetti all'array per pubblicare nuovi prodotti nel catalogo.
I workshop mostrano prezzo e tesseramento incluso e rimandano alle pagine dei corsi tramite `detailsLink` finché il pagamento Stripe non è attivo.
