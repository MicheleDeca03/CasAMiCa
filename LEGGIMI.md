# CasA.Mi.Ca. — sito vetrina

Sito statico (HTML, CSS, JavaScript). Nessun database, nessuna prenotazione
online: serve a far vedere la casa e a farsi scrivere.

**Via del Faro 176 — 72015 Torre Canne (BR)**

---

## 1. Cosa manca prima di pubblicare

Una cosa sola. In cima a `index.html` ci sono due tag con un indirizzo finto,
segnati con `⚠️ MODIFICA QUI`:

```html
<link rel="canonical" href="https://ESEMPIO.github.io/casamica/">
<meta property="og:image" content="https://ESEMPIO.github.io/casamica/img/og.jpg">
```

Sostituisci `ESEMPIO.github.io/casamica` con l'indirizzo vero del sito. Il
secondo **deve** essere un indirizzo completo: è la foto che compare quando
mandi il link su WhatsApp.

Contatti, indirizzo, link ad Airbnb e Booking e coordinate della mappa sono già
quelli veri.

Da rileggere invece perché l'ho scritto io a occhio: le tre righe su biancheria,
animali e check-in nella sezione Servizi (cerca `⚠️ MODIFICA QUI`).

---

## 2. Come pubblicarlo

### GitHub Pages

1. Crea un repository, per esempio `casamica`.
2. Carica dentro tutto il contenuto di questa cartella. `index.html` deve stare
   nella radice, non in una sottocartella.
3. Settings → Pages → Source `Deploy from a branch`, branch `main`, cartella
   `/ (root)` → Save.
4. Dopo un minuto è online.

### Netlify

Trascina la cartella su [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 3. Le foto stanno nella repo

GitHub Pages serve qualsiasi file statico che trova nella repo, immagini
comprese. Non serve Imgur, Cloudinary o un hosting a parte.

- il sito pesa **15 MB**, il file più grande è 576 KB
- la prima schermata scarica circa **2,5 MB**; il resto arriva solo scorrendo
- i limiti di Pages sono 1 GB di sito e 100 GB di traffico al mese

**Non usare Git LFS per le immagini.** Pages non le serve: al posto della foto
arriva un file di testo. Normale `git add`.

**Attenzione alle maiuscole.** Sul tuo computer `Foto.JPG` e `foto.jpg` sono lo
stesso file, sul server di GitHub no. I nomi qui dentro sono già tutti
minuscoli.

Nella cartella c'è un file vuoto chiamato `.nojekyll`: dice a GitHub di
pubblicare i file così come sono. È nascosto, controlla che venga caricato.

**Repo privata?** Con GitHub Student hai GitHub Pro, quindi puoi. Il *sito*
resta comunque pubblico: è privato il codice, non le pagine.

---

## 4. Com'è fatto

```
index.html            la pagina (unica)
.nojekyll             (vuoto, non cancellare)
assets/
  style.css           tutti gli stili
  main.js             menu, galleria, filtri, mappa
  fonts.css           dichiarazioni dei font
  fonts/              Bricolage Grotesque, Instrument Sans, Martian Mono
  leaflet/            la libreria della mappa
img/                  26 foto a 1800px + marchio + anteprima social
img/t/                le stesse foto in miniatura (820px)
```

Font e mappa sono in locale: il sito non chiama Google né altri server. L'unica
cosa che arriva da fuori sono le mattonelle della mappa (OpenStreetMap +
CARTO), che non tracciano l'utente.

**Colori e font** sono tutti in cima a `assets/style.css`, nel blocco `:root`.
La palette è presa dall'acqua delle tue foto; il verde-azzurro del marchio è
quello del logo.

`img/marchio.png` è il logo senza scritta, per fondi chiari.
`img/marchio-chiaro.png` è lo stesso per fondi scuri.

---

## 5. Modifiche più comuni

**Cambiare una foto**
Sostituisci il file in `img/` con lo stesso nome, e la miniatura in `img/t/`.
Massimo 1800px di lato lungo, qualità 75–80.

**Aggiungere una foto alla galleria**
Copia una riga dentro `<div class="grid">` e cambia `data-full`, `data-label`,
`src` e `alt`. Il contatore ("1/26") si aggiorna da solo, ma il titolo della
sezione dice "Ventisei fotografie": cambialo a mano.

**Aggiungere un luogo nei Dintorni**
Copia una riga `<li data-cat="...">` e cambia:
- `data-cat` → `piedi`, `auto` oppure `gita`
- `data-lat` / `data-lng` → coordinate (tasto destro su Google Maps, clic sui
  numeri in cima al menu, si copiano da soli)
- `data-km` → distanza in chilometri col punto decimale (es. `0.4`)
- nome, descrizione, distanza e tempo visualizzati

Il rombo sulla scala si posiziona da solo e il segnaposto compare sulla mappa
senza toccare altro.

**Angoli più o meno arrotondati**
In cima a `assets/style.css`, nel blocco `:root`:
`--r` (14px) è il raccordo di foto, mappa e galleria, `--r-sm` (9px) quello
degli elementi piccoli, `--pill` è per bottoni e filtri. Cambia lì e cambia
ovunque. Le foto a tutta larghezza (hero e banda del mare) restano squadrate
apposta.

**Mappa scura invece che chiara**
In `assets/main.js` cerca `rastertiles/voyager` e sostituiscilo con `dark_all`.
