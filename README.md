## Hero restaurat

La cererea utilizatorului, Acasa foloseste din nou videoclipul initial `assets/videos/hero.mp4` si posterul `assets/images/hero-poster.jpg`, anterioare variantelor cinematic si detail.

## Actualizare Hero ? 22 octombrie 2026

Acas? folose?te acum `assets/videos/hero-detail.mp4` ?i posterul extras `assets/images/hero-detail.jpg`. Surs?: [Close up of Dental Instruments ? cottonbro studio / Pexels](https://www.pexels.com/video/close-up-of-dental-instruments-6502645/), [Pexels License](https://www.pexels.com/license/). Binar: https://videos.pexels.com/video-files/6502645/6502645-hd_2048_1080_25fps.mp4 . Cadru aproape fix cu instrumentar ?n prim-plan ?i activitate ?n fundal; comparate cadre la intervale de dou? secunde, p?strate ?n `qa/detail-contact.jpg`. F?r? zoom CSS sau deplasare Hero la scroll. Redare la 0,85; comportamentul de pauz? ?i fallback este p?strat. Redarea ?n browser nu a putut fi verificat?: browserul integrat nu este disponibil. Material stock ilustrativ.

# VELORA Dental

Site static de portofoliu realizat în HTML, CSS și JavaScript, fără dependențe sau proces de build. Nu a fost publicat.

## Deschidere

Deschide acest folder în VS Code, instalează extensia Live Server dacă nu este deja disponibilă, apoi clic dreapta pe `index.html` → **Open with Live Server**. Cele cinci pagini funcționează și deschise direct, dar un server local oferă comportamentul recomandat pentru fișierele media.

## Modificări

- Textele și conținutul sunt direct în cele cinci fișiere HTML. Headerul și footerul sunt prezente în fiecare pagină.
- Telefonul și emailul se modifică în `contact.html` și în footerul fiecărei pagini.
- Fotografiile sunt în `assets/images`, videoclipurile în `assets/videos`, fonturile în `assets/fonts`, logo-ul și iconițele în `assets/icons`.
- Culorile sunt variabilele din `:root` la începutul `assets/css/style.css`. Același fișier conține regulile responsive.
- Interacțiunile sunt în `assets/js/script.js`.
- `build-site.cjs` este un generator opțional de conținut, utilizat la realizare. Site-ul nu depinde de el. Dacă îl rulezi din nou, suprascrie cele cinci pagini; pentru editări manuale lucrează direct în HTML.

## Comportament intenționat

Formularul nu trimite, nu validează, nu stochează și nu resetează datele. Butonul este `type="button"`; submit și Enter în câmpurile cu o singură linie sunt blocate. Enter în mesaj permite un rând nou. Telefonul, emailul, iconițele sociale și informațiile juridice sunt elemente statice, fără acțiuni.

Tarifele și identitățile echipei sunt cele solicitate pentru prezentare. Tarifele nu provin din cercetare de piață. Portretele sunt materiale de ilustrare, conform ASSETS.md, fără a reprezenta acreditări sau identități profesionale verificate. Nu există backend, confirmări de programări, analytics ori cookie-uri.

Video-ul Hero se încarcă automat doar peste 800px, fără preferință de mișcare redusă sau economisire de date detectată. În celelalte situații rămâne posterul local. Videoclipul din Clinica se încarcă la cererea utilizatorului.

Hero-ul afișează videoclipul pe întreaga suprafață, cu text alb deasupra, ca în amplasarea inițială. Aspectul cinematic folosește contrast crescut, saturație redusă și tonuri ușor calde, fără blur. O umbrire laterală neagră susține lizibilitatea textului. Animațiile comune sunt la finalul CSS-ului și JavaScriptului: apariții succesive ale textelor, zoom fotografic la intrare, deplasare și zoom sincronizate cu scrollul, plus reacții la hover. Mișcarea este redusă pe mobil și dezactivată pentru `prefers-reduced-motion`; conținutul rămâne vizibil fără JavaScript.

Rafinamentele de compoziție sunt în `assets/css/refinements.css`, încărcat după stilurile principale. Hero-ul folosește `assets/videos/hero-cinematic.mp4` (Full HD, 10,6 secunde, aproximativ 2,34 MB), cu posterul oficial `hero-cinematic.jpg`, viteză 0,85 și zoom lent care se oprește odată cu videoclipul. Clipul este pus pe pauză când Hero-ul iese din ecran sau tabul devine inactiv. Revenirea reia redarea numai dacă utilizatorul nu a ales manual pauza. Fișierul Hero anterior este păstrat, dar nu este încărcat de pagină. Sursa noului clip este în `assets/ASSETS-cinematic.md`.

Sursele și licențele materialelor, precum și eventualele limitări, sunt în `ASSETS.md`.

## Starea materialelor media

Materialele sunt acum descărcate și integrate: 16 fotografii stock WebP, trei portrete originale generate cu ImageGen, două videoclipuri MP4 720p și două postere oficiale JPEG. Portretele nu reprezintă medici reali. Toate sunt locale; nu există hotlinkuri. Ilustrațiile SVG inițiale rămân în folder ca resurse neutilizate.

Manrope și Cormorant Garamond sunt locale în WOFF2, cu subset latin-ext și licențe OFL. `assets/css/fonts.css` este încărcat înainte de stilurile site-ului. Generatorul preferă WebP, apoi JPEG, apoi SVG și citește dimensiunile imaginilor. `Download-Photos.ps1` poate recupera fotografiile absente din selecția documentată în `assets/photos.json`; omite fișierele existente. Nu este necesar pentru vizitarea site-ului.

## Verificări locale

Cu Node.js disponibil, `node verify.cjs` verifică numărul paginilor, fișierele locale, linkurile și ancorele, titlul principal și restricțiile de interfață. `node interaction-check.cjs` verifică izolat logica meniului și a formularului. `node http-check.cjs` pornește temporar un server pe loopback, verifică răspunsurile paginilor și îl oprește automat.

`node media-check.cjs` verifică izolat viteza și pauza videoclipului, sincronizarea zoomului cu pauza, oprirea în afara ecranului, păstrarea pauzei manuale, fallback-ul pe mobil/economisire de date/reduced motion și navigarea galeriei cu revenirea focusului. După rafinare, verificarea HTTP acoperă 43 de pagini și resurse referite, fără erori.

Aceste verificări nu înlocuiesc inspecția într-un browser. Browserul integrat nu a fost disponibil în sesiunea de implementare; capturile de ecran, randarea la 360, 390, 430, 768, 1024 și 1440px, zoom 200%, consola browserului și redarea media nu au putut fi verificate vizual. Breakpointurile și comportamentul reduced motion sunt implementate în CSS și JavaScript.
