# PROJECT X · Designsystem

Die bestehende Identität bleibt erhalten: dunkles Oliv-Anthrazit, weiches Elfenbein und gezieltes Champagner. Die Gestaltung verbindet einen ruhigen privaten Zugang mit einem inszenierten Geburtstagsfinale. Mobile ist die wichtigste Plattform. Die Oberfläche arbeitet in der Challenge funktional; erst der letzte Schlüssel und das Geschenk bekommen größere dramaturgische Gesten.

## Verbindliche Quellen

- `src/styles.css`: zentrale Farb-, Schrift-, Radius-, Abstands- und CSS-Motion-Tokens in `@theme`.
- `src/design/motion.ts`: gemeinsame Easing-Kurve, Spring und Zeitpunkte der Inszenierung.
- `src/components/ui.tsx`: Buttons, Screenwechsel, Überschriftenfokus und Fortschritt.
- `src/features/quiz/content.ts`: unveränderter Fragenkatalog und vorgegebene Geschenkdetails.

## Farben

| Token | Wert | Verwendung |
| --- | --- | --- |
| ground | `#171916` | Hintergrund |
| surface / surface-hover | `#20231f` / `#292d27` | Antwortflächen |
| ink / muted | `#f3f0e8` / `#a9ada3` | Haupt- und Sekundärtext |
| gold / gold-hover | `#dac49c` / `#e8d5b4` | Aktionen und bewusste Betonung |
| button-ink | `#24271f` | Text auf Champagner |
| line | `#363a32` | Trenner und Fortschrittsspur |
| field / field-border | `#1d201b` / `#52574a` | Eingaben |
| answer-border | `#505649` | Antwortkonturen |
| positive / negative | `#afd3b3` / `#edb8a5` | Rückmeldung |
| correct-surface / border / ink | `#29392b` / `#789b76` / `#d0e7cd` | Richtige Auswahl |
| wrong-surface / border / ink | `#392d25` / `#ac8165` / `#f0c7b4` | Falsche Auswahl |

Feedback besitzt immer Text und Check- oder Kreuzsymbol. Die dunklere Schlüssel-/Entschlüsselungsfläche ist `#0b0d0c`. Materialverläufe sind auf Zugangsmotiv, Bildgrading und den einzelnen Lichtimpuls im Finale begrenzt. Gewöhnliche Controls erhalten keine Glows.

## Typografie und Rhythmus

Lokal gehostete **Manrope Variable** für Überschriften und **DM Sans Variable** für Text und Bedienung; keine externen Schriftabrufe. Headline-Gewichte liegen überwiegend bei 500, Künstlernamen bei 650. Tracking liegt zwischen −0,035 und −0,04 em. Überschriften balancieren, Fließtexte nutzen `text-wrap: pretty`.

Fragen: `clamp(23px, 2.4vw, 34px)`, Zeilenhöhe 1,35; mobil `clamp(23px, 6.3vw, 29px)`. Antworten: 15 px, mobil 14 px, Zeilenhöhe 1,5. Eingaben: durchgehend 16 px, um den automatischen iOS-Fokuszoom zu vermeiden. Der letzte Schlüssel wächst auf `clamp(64px, 10vw, 112px)` und erhält eine eigene mobile Skala. Die finale Künstlerzeile ist responsiv auf die verfügbare Spaltenbreite abgestimmt.

Die wiederkehrenden Abstände für Controls, Gruppen und Abschnitte sind 16, 24 und 40 px. Kontrollen haben 10 px Radius, Bild- und Ticketflächen 14 px. Vertikaler Raum gruppiert zusammengehörige Inhalte; keine gestapelten dekorativen Karten.

## Layout

Shell maximal 1440 px, Quiz maximal 1100 px, Login und Finale maximal 1040 px. Desktop zeigt Zugangsmotiv beziehungsweise Quizmotiv neben der Interaktion. Die Fragenbilder haben stabil 4:5, auf Smartphones 16:9, `object-fit: cover` und ein einheitliches zurückhaltendes Grading. Feste Bildflächen vermeiden Verschiebungen beim Laden und bleiben bei Bildfehlern bestehen.

Bis 640 px stehen Inhalt und Bild untereinander; Seitengutter 24 px, bis 360 px 20 px. Safe-Area-Werte ergänzen die Außenabstände. Zwischen 641 und 800 px werden die Quizspalten und Headline-Größen angepasst. Kein Screen erzwingt eine feste Höhe; lange Fragen und die Bildschirmtastatur dürfen natürlich scrollen.

Das Finale zeigt auf Desktop das Tourmotiv links und die Widmung/Veranstaltung rechts. Auf Smartphones erscheint das Motiv zuerst in einem kompakteren 5:4-Ausschnitt. Das Motiv ist eine eigene typografische Gestaltung über einem vorhandenen lokalen Stadtfoto, kein offizielles Albumcover oder Künstlerfoto.

## Interaktion und Motion

- Gemeinsames Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Screens: 320 ms, 12 px Eintritt und 6 px Austritt, opacity und transform.
- Drücken: Buttons Scale 0,97, breite Antwortkarten 0,985 (`press` in `motion.ts`), Spring 300 ms ohne Bounce.
- Falsche Antwort: einmaliger, gedämpfter Seitenimpuls (±5 px, 360 ms, `wrongNudge`), zusätzlich Peach-Farbe, Kreuz und Text.
- Hover-Zustände nur auf Geräten mit echtem Hover (`@media (hover: hover)`), damit auf Touchscreens nichts „hängen bleibt“.
- Dramaturgie: Ab Frage 8 dunkelt der Hintergrund leicht ab (`data-stage="late"`), bei Frage 10 stärker (`"final"`).
- Login: einmaliger Lichtaufbau hinter dem X (2,4 s), keine Schleife.
- Zustandsfarben: 150 ms; ungewählte Antworten verblassen nach Erfolg über 400 ms.
- Fortschritt: 500 ms über `scaleX`, ohne Änderung der Layoutbreite.
- Letzte Antwort: einmalige 850-ms-Erfolgslinie, anschließend nach 1100 ms Schlüsselbildschirm.
- Schlüssel: Titel zuerst, Bestätigung nach 1000 ms, Freischaltaktion nach 1900 ms.
- Schlüssel: Header und Footer treten auf 35 % zurück.
- Entschlüsselung: 3000 ms, ein Lichtimpuls und eine Fortschrittsspur; Header, Footer und Musikhinweis blenden aus, die Headline lautet „DEIN GEWINN WIRD ENTSCHLÜSSELT.“
- Reveal: Motiv, Widmung, Konzertdaten, Nachricht und Ticketaktion im Abstand von 500 ms. Die Ticketaktion wird erst nach ihrem Eintritt bedienbar.

Reduced Motion entfernt räumliche Bewegungen und Tap-Skalierung, setzt kurze Überblendungen und verkürzt die dramaturgischen Wartezeiten. Alle Timer werden beim Verlassen bereinigt; dekorative Animationen laufen nicht endlos. Fragen 1–9 behalten den expliziten Weiter-Button, damit das Feedback in Ruhe lesbar bleibt. Nur der letzte Schlüssel führt automatisch zur Bestätigung. Der Reducer verwirft doppelte und veraltete Aktionen.

## Zugang und Zugänglichkeit

Der Login wird direkt am Formular als Inszenierung erläutert. Beliebige syntaktisch gültige E-Mail und ein erfundenes Passwort reichen. Angaben werden vor dem Screenwechsel geleert und weder gespeichert noch versendet. Fehlermeldungen sind feldbezogen, mit dem Feld verbunden und fokussieren die erste fehlerhafte Eingabe.

Neue Screens fokussieren ihre Überschrift. Semantische Buttons, `aria-pressed`, `aria-disabled`, Live-Rückmeldungen und eine sichtbare 2-px-Fokuskontur ergänzen Farbe und Bewegung. Hauptaktionen sind mindestens 54 px hoch, mobil 56 px; zusätzliche Touchcontrols mindestens 44 px. Der Fortschritt verwendet zugängliche Zahlenwerte und tabellarische Ziffern.

## Geschenktickets und Export

Zwei klar gekennzeichnete Geschenkversprechen für Gillian und Begleitung +1. Keine Barcodes, QR-Codes, Sitzplätze oder Ticketnummern. Die sichtbaren Tickets passen sich dem Display an. Eine separate, für Assistenztechnik und Interaktion ausgeblendete 540-px-Vorlage liefert mit Pixelratio 2 immer ein 1080 px breites PNG. Die Vorlage verwendet dieselbe Komponente, explizite linksbündige Typografie und exporteigene feste Schriftgrößen. Sie enthält keine Bedienknöpfe.

## Berlin-lebt-3-Welt (ab dem Freischalten)

Mit „GEWINN FREISCHALTEN“ wechselt die App per `data-world="berlin"` auf eigene Tokens: Grund `#070707`, Rot `#e3141f` (Text `#ff3341`), Buttons rot mit weißer Schrift. Überschriften: Manrope 800, Versalien, `skewX(-8deg)` als Anlehnung an die kursive Tour-Typografie. Leitmotiv ist die EKG-Linie aus dem Logo („LEBT“) als Übergang, Trenner und Ticket-Element.

Sequenz: 3,3 s Herzschlag (drei Schläge mit rotem Lichtimpuls) → 0,8 s Glitch (RGB-Versatz, Scanlines, rote Blitze) → Trailer fliegt in 3D herein (rotateX 32° → 0, 1,3 s) → bei 46 s roter Blitz, MP3 übernimmt → Gewinnseite mit Poster (Neigung bis 7°, Lichtreflex) und „Slam“-Texten (Skalierung und Unschärfe auf scharf, 320 ms Staffelung) → zwei Tickets mit 3D-Neigung, Holo-Glanz und Umdrehen. Reduced Motion: kein Glitch, keine Neigung, kein Rauch, kurze Überblendungen; das Video bleibt.

Der Export zeigt die Ticket-Vorderseite im Berlin-lebt-3-Branding (Poster, Logo, EKG-Linie, Daten) als 1080 px breites PNG.
