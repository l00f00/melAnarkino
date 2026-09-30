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
