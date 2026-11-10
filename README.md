# PROJECT X · Private Access

Eine statische, deutschsprachige Challenge für Gillian. Der Geburtstag und das Konzertgeschenk werden erst im Finale sichtbar. Das bestehende React-Projekt wurde gezielt weiterentwickelt; Vite, TypeScript, Tailwind v4, Motion, lokale Schriften und GitHub-Pages-Konfiguration bleiben erhalten.

## Lokal starten

Node.js 24 und npm:

```sh
npm ci
npm run dev
```

Die lokale Adresse enthält den Projektpfad `/quiz_user_gillian93/`. Für die Produktionsvorschau `npm run build` und `npm run preview` ausführen.

## Ablauf

Login → Identity Check → Mission Briefing → Fragen 1–5 → Halbzeit → Fragen 6–10 → Abschluss → Klick auf „GEWINN FREISCHALTEN“ → Entschlüsselung → Konzert-Reveal → zwei Geschenktickets.

Der Login wirkt wie ein echter Zugang, prüft aber nur im Browser gegen die Zugangsdaten in `access` (`src/features/quiz/content.ts`). Diese Daten bekommt Gillian mit der Einladung. Falsche Daten zeigen eine Fehlermeldung. Die Eingaben werden weder gespeichert noch versendet. Es gibt keinen Server und keine echte Zugangskontrolle; Fragen, Zugangsdaten und Geschenkdetails stehen im Frontend-Code.

Falsche Antworten können erneut versucht werden und verraten die richtige Antwort nicht. Richtige Antworten erhöhen den Fortschritt und schalten die Aktion zur nächsten Frage frei. Der Ablauf hat kein Zeitlimit. Nach Frage 5 erscheint die Halbzeit. Nach der richtigen Antwort auf Frage 10 verblassen die übrigen Karten. Nach einem kurzen Erfolgsfeedback folgt automatisch „BERLIN LEBT“, dann die Bestätigung des letzten Schlüssels und erst danach die Freischaltaktion. Das Geschenk bleibt bis zum bewussten Freischalten verborgen.

Der Fortschritt liegt ausschließlich in `sessionStorage` unter `project-x:progress:v1`. Neuladen setzt am aktuellen Screen fort. Bei unterbrochener Entschlüsselung erscheint wieder der Freischalt-Button. Ohne verfügbaren Browserspeicher funktioniert der Ablauf weiterhin, allerdings ohne Wiederherstellung nach Neuladen. „Neu beginnen“ im Footer (auf allen Screens außer dem Login) setzt die Runde zurück.

## Inhalte bearbeiten

`src/features/quiz/content.ts` enthält den exakten Fragenkatalog, Bilddateien und Alternativtexte, `gift` mit Konzertdaten und persönlicher Nachricht sowie die Musik-Konfiguration.

Die vorgegebenen Geschenkdetails sind übernommen: **2 Tickets für Samra & Capital Bra, Berlin lebt 3, 01.04.2027, Sporthalle Hamburg**. Sie wurden nicht gegen einen Veranstalterkalender geprüft.

### Bilder

Die zehn Bilder liegen lokal unter `public/images/questions/`. Es sind austauschbare atmosphärische Stockmotive; keine offiziellen Künstlerfotos oder WoW-Screenshots. Das Pasta-Bild zeigt ein allgemeines Pasta-Motiv, keine Carbonara. Herkunftslinks stehen in `public/images/questions/SOURCES.md` und in den Bildmetadaten.

Eine Datei mit gleichem Namen ersetzen oder `image` und `imageAlt` im Fragenkatalog anpassen. Empfehlenswert sind JPEG/WebP, mindestens 1000 px Breite und ein mittig platziertes Motiv. Die Ansicht vereinheitlicht die Motive über Ausschnitt, reduzierte Sättigung und ein dunkles Overlay. Sämtliche URLs nutzen Vites `BASE_URL` und funktionieren im GitHub-Pages-Unterverzeichnis. Ein nicht ladendes Bild lässt eine ruhige, weiterhin bedienbare Motivfläche stehen.

### Finale: Trailer, Musik und Berlin-lebt-3-Look

Dateien in `public/media/` (Steuerung in `src/features/quiz/finaleMedia.ts`):

| Datei | Inhalt |
| --- | --- |
| `berlin-lebt-3-trailer.mp4` | Offizieller Trailer, auf 36 s gekürzt, 1280×720 H.264, ca. 12,5 MB |
| `berlin-lebt-3.mp3` | Tonspur des Trailers, läuft nach dem Video als Loop weiter |
| `berlin-lebt-3.jpg` | Tourplakat für Gewinnseite und Geschenktickets |
| `heartbeat.m4a` | Herzschlag aus `media-src/soundreality-heart-beat-137135.mp3` (Pixabay), zugeschnitten mit `scripts/heartbeat.py`: vier Schläge auf den Lichtimpulsen, Stottern ab Schlag 3, Echo nach dem letzten, verlangsamter Einschlag beim Glitch |

Die Rohdateien (MOV, GIFs) liegen in `media-src/`. Der Ordner wird weder veröffentlicht noch committet.

Ablauf nach „GEWINN FREISCHALTEN“: Herzschlag-Linie aus dem Logo (vier Schläge, das Signal zerfällt zunehmend), Glitch, Wechsel der ganzen App auf Schwarz/Rot. Danach fliegt der Trailer als 3D-Leinwand herein und läuft mit Ton. Bei Sekunde 34,2 (`finaleMedia.cut`), wenn beide auf die Kamera zutreten, oder bei „Überspringen“ übernimmt die MP3 an derselben Stelle. Das Bild läuft stumm weiter, während die Leinwand in die Gewinnseite zoomt. Es folgen die Gewinnseite mit neigbarem Poster und zwei 3D-Geschenktickets zum Umdrehen. Auf Handys reagieren Poster und Tickets auf das Neigen des Geräts (`deviceMotion.ts`), mit der Maus oder per Fingerwisch geht es ebenfalls. iOS fragt dafür einmal nach „Bewegung und Ausrichtung“: Die Abfrage kommt beim Tipp auf „IDENTITÄT BESTÄTIGEN“. Ohne Erlaubnis funktioniert der Fingerwisch weiter.

Der Klick auf „GEWINN FREISCHALTEN“ gibt den Ton frei. Verweigert ein Browser trotzdem den Ton, startet das Video stumm mit sichtbarem „Ton an“. Lädt das Video nicht, geht es direkt zur Gewinnseite weiter. Nach einem Neuladen startet Musik nur über „Musik starten“ oben rechts. Auf dem iPhone ignoriert der Browser die Lautstärke (`trackVolume`); „Ton aus“ funktioniert. Trailer, MP3 und Poster werden erst nach dem Freischalten geladen.

Der Herzschlag ist exakt auf die Animation geschnitten: Schläge bei 1,8 / 3,6 / 5,1 / 6,3 s, immer schneller und lauter, ab Schlag 3 bricht das Signal auf, bei 7,2 s folgt der volle Glitch. Die Zeiten stehen zentral in `pulseTimeline` (`src/features/quiz/berlin.ts`). Wer sie ändert, passt `scripts/heartbeat.py` an und erzeugt die Datei neu (Befehle stehen oben im Skript). Bei reduzierter Bewegung entfällt der Sound, weil die Animation dort kürzer ist.

Trailer neu kürzen: `media-src/video/video.mov` mit einem Encoder auf H.264/AAC mit Fast-Start umwandeln und die Datei gleichen Namens ersetzen.

### Nachricht und Tickets

Die provisorische Anmerkung „Text noch ändern?“ wurde durch einen fertigen Geburtstagsgruß ersetzt. Dieser steht in `gift.message` und kann persönlich angepasst werden. Die beiden übrigen Botschaften stehen in `ResultScreen.tsx`.

Beide Karten sind als symbolische Geschenktickets gekennzeichnet und keine Eintrittskarten. „GESCHENKTICKET SPEICHERN“ exportiert das Gillian-Ticket lokal mit `html-to-image` als `project-x-gillian-ticket.png` aus einer festen 540-Pixel-Vorlage in doppelter Auflösung (1080 Pixel breit), unabhängig von der Bildschirmgröße. Die Exportvorlage enthält keine Bedienelemente und ist von Tastatur und Assistenztechnik ausgeschlossen. Falls das Handy den Download nicht anbietet, lässt sich das erzeugte Bild separat öffnen und per langem Druck speichern. Die Bildvorschau bleibt bis zum Verlassen des Screens verfügbar. Kein Upload und kein externer Exportdienst.

## Dateien und Verantwortlichkeiten

| Datei | Aufgabe |
| --- | --- |
| `src/App.tsx` | Screen-Auswahl, Shell, Freischaltaktion und Musik-Aktivierung |
| `src/components/ui.tsx` | Wiederverwendbare Buttons, Screen-Übergänge, Fokus und Fortschritt |
| `src/features/quiz/content.ts` | Fragen, Bildzuordnung, Geschenk, persönliche Nachricht und Musik-ID |
| `src/features/quiz/state.ts` | Zulässige Übergänge, Wiederholungsversuche und validierte Wiederherstellung |
| `src/features/quiz/useQuiz.ts` | Reducer und Sitzungsspeicherung |
| `src/features/quiz/LoginScreen.tsx` | Simulierter Login mit Formularvalidierung |
| `src/features/quiz/IntroScreen.tsx` | Mission Briefing |
| `src/features/quiz/QuestionScreen.tsx` | Bildfragen und Antwortfeedback |
| `src/features/quiz/StoryScreens.tsx` | Verifikation, Halbzeit, Abschluss und Entschlüsselung |
| `src/features/quiz/ResultScreen.tsx` | Gestaffelte Konzert-Enthüllung und persönliche Botschaft |
| `src/features/quiz/TicketScreen.tsx` | Beide Geschenktickets, PNG-Export und mobile Speicherhilfe |
| `src/features/quiz/FinaleSequence.tsx` | Herzschlag, Glitch-Switch, Trailer und Übergabe an die MP3 |
| `src/features/quiz/finaleMedia.ts` | Medienpfade, Schnittpunkt, Ton-Freigabe im Klick |
| `src/features/quiz/berlin.ts`, `berlinUi.tsx` | EKG-Linie aus dem Logo, 3D-Neigung |
| `src/features/quiz/MusicPlayer.tsx` | Ton-an/aus und Musik-starten im Finale |
| `src/styles.css`, `src/design/motion.ts` | Responsive Darstellung, bestehende Farbwelt und Animationen |
| `index.html`, `public/favicon.svg` | Geheimniswahrende Metadaten und PROJECT-X-Signet |
| `public/images/questions/` | Zehn lokale, austauschbare Motivbilder und Herkunftsnachweise |
| `src/features/quiz/state.test.ts`, `tests/quiz.spec.ts` | Logiktests und Desktop-/Mobil-Browsertests |

`html-to-image` war bereits vorhanden. Für diesen Premium-Polish wurden keine Bibliotheken installiert und keine Paketdateien geändert.

## Qualität und Zugänglichkeit

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Beim ersten Playwright-Einsatz gegebenenfalls `npx playwright install chromium webkit` ausführen. Die Tests laufen in drei Projekten: Desktop-Chrome, iPhone-Viewport mit Chromium und iPhone-Viewport mit WebKit (Safari-Engine). Die Tests verwenden den Produktionsbuild auf Port 4173. Abgedeckt sind der vollständige Ablauf, falsche und richtige Antworten, Halbzeit, Session-Wiederherstellung, blockierter Speicher, beschädigte Daten, bewusste Freischaltung, Tastaturbedienung, reduzierte Bewegung, schmale Ansichten sowie der Download einer echten PNG-Datei. WebKit deckt die Safari-Engine ab, ersetzt aber keinen Test auf einem echten iPhone (Ton, Bewegungssensor, Download-Verhalten).

Semantische Formulare, beschriftete Eingaben, sichtbare Fokuszustände, Fokus auf neuen Überschriften und Live-Feedback sind vorhanden. Systemseitig reduzierte Bewegung wird respektiert. Lokale Bilder und Schriften vermeiden externe Requests während der Challenge.

## GitHub Pages

`vite.config.ts` verwendet weiterhin `base: '/quiz_user_gillian93/'`. Der Workflow `.github/workflows/pages.yml` baut und veröffentlicht `dist/` bei jedem Push auf `main` (nach Lint, Unit-Tests und Build); manuell startbar ist er ebenfalls. Vor der ersten Veröffentlichung im Repository **Settings → Pages → Source: GitHub Actions** wählen. Bei Umbenennung des Repositorys auch `base` und die Test-URLs in `playwright.config.ts` anpassen.

`DESIGN.md` dokumentiert das aktuelle Designsystem. Die Bestandsaufnahme, Änderungen und tatsächlich ausgeführten Prüfungen stehen in `PROJECT-X.md`.

## Noch zu befüllen

- Optional eine persönlichere Geburtstagsnachricht.
- Optional eigene Bilder statt der bereits eingebundenen Stockmotive.

Für die Funktion des Quiz und des Ticketdownloads sind keine weiteren Inhalte erforderlich.

## Premium-Polish

Das Finale nutzt ein eigenes typografisches Tourmotiv über dem vorhandenen lokalen Stadtfoto, kein offizielles Albumcover. Die Enthüllung zeigt Motiv, Widmung, Konzertdaten und persönliche Nachricht zeitlich gestaffelt; die Ticketaktion wird erst am Ende freigegeben. `src/design/motion.ts` bündelt die relevanten Zeitpunkte. Fragen und richtige Antworten wurden nicht verändert.
