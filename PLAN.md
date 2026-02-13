# Silbenteppich-Lernspiel - Implementierungsplan

## Kontext
Ein Browser-basiertes Lernspiel fuer ein 9-jaehriges Kind mit Lese-/Rechtschreibschwaeche (LRS), das aktuell in Lerntherapie Silbenteppiche uebt. Das Spiel soll Silben vorlesen, das Kind klickt die richtige Silbe. Das System passt sich automatisch an: bei Erfolg schwieriger, bei Fehlern leichter.

## Tech Stack
- **Vanilla HTML/CSS/JavaScript** - kein Build-Tool, direkt im Browser oeffnbar
- **Web Speech API** (SpeechSynthesis) fuer deutsche Sprachausgabe
- **LocalStorage** fuer Spielstand-Persistenz
- Einzelne `index.html` + `style.css` + `game.js` + Datendateien

## Projektstruktur

```
silbenlernspiel/
  index.html          # Hauptseite
  css/
    style.css         # Styling, Animationen, responsive Design
  js/
    game.js           # Hauptspiellogik + Game Loop
    levels.js         # Level-Definitionen & Schwierigkeitsgrade
    speech.js         # Web Speech API Wrapper
    puzzle.js         # Puzzle-Belohnungssystem
    storage.js        # LocalStorage Spielstand
    syllables.js      # Silben- und Woerterdaten
  images/
    puzzles/          # Puzzle-Bilder (einfache SVGs oder generiert)
  sounds/             # Optional: Erfolgs-/Fehler-Sounds
```

## Spielablauf (Game Loop)

1. **Start-Screen**: Begruessung, "Spiel starten" Button, ggf. vorheriger Spielstand laden
2. **Runde starten**:
   - System waehlt Ziel-Silbe/Wort basierend auf aktuellem Level
   - Silbenteppich (Grid) wird mit bunten Silben gefuellt (Ziel + Ablenker)
   - Ziel-Silbe wird per Sprachausgabe vorgelesen
3. **Spieler klickt**:
   - Richtig → gruene Animation, Punkte, Konfetti-Effekt
   - Falsch → sanftes rotes Wackeln, ermutigende Nachricht, Silbe wird nochmal vorgelesen
4. **Auswertung**: Adaptives System passt Schwierigkeit an
5. **Belohnung**: Bei Meilensteinen → Puzzleteil freischalten
6. **Naechste Runde** oder **Level-Up Animation**

## Schwierigkeitsstufen (Levels)

### Level 1: Offene Silben
- Silben: ma, me, mi, mo, mu, la, le, li, lo, lu, ra, re, ri, ro, ru, sa, se, si, so, su, na, ne, ni, no, nu, ta, te, ti, to, tu, da, de, di, do, du, fa, fe, fi, fo, fu, wa, we, wi, wo
- Grid: 4x3 (12 Silben)
- Aufgabe: "Klicke auf [Silbe]"

### Level 2: Geschlossene Silben
- Silben: man, mel, rin, sol, tur, kan, pel, wis, don, fur, etc.
- Grid: 4x3 (12 Silben)

### Level 3: Gemischte Silben (offen + geschlossen)
- Mix aus Level 1 und 2
- Grid: 5x3 (15 Silben)

### Level 4: Zweisilbige Woerter
- Woerter: Ma-ma, Pa-pa, Na-se, Ro-se, Ho-se, Do-se, Le-se, Rei-se, etc.
- Aufgabe: Wort wird vorgelesen, Kind klickt die Silben in richtiger Reihenfolge
- Grid: 4x3 (12 Silben), 2 Klicks noetig

### Level 5: Schwierigere zweisilbige Woerter
- Woerter mit geschlossenen Silben: Kin-der, Gar-ten, Fen-ster, Man-tel
- Grid: 5x3 (15 Silben)

### Level 6: Dreisilbige Woerter
- Woerter: Ba-na-ne, To-ma-te, La-ter-ne, Scho-ko-la-de
- Grid: 5x4 (20 Silben), 3 Klicks noetig

### Level 7+: Weitere Steigerungen
- Laengere Woerter, komplexere Silben, groesseres Grid

## Adaptives System

```
Regeln:
- Streak-Zaehler: zaehlt aufeinanderfolgende richtige/falsche Antworten
- 5x richtig in Folge → Level hoch (mit Fanfare-Animation)
- 3x falsch in Folge → Level runter (mit ermutigender Nachricht)
- Innerhalb eines Levels: Silben die oft falsch waren, werden haeufiger gezeigt
- "Schwierige Silben" Liste pro Kind wird in LocalStorage gespeichert
```

## Punkte-System

- **Basis**: 100 Punkte pro richtige Antwort
- **Geschwindigkeitsbonus**:
  - Unter 2 Sekunden: +50 Punkte
  - Unter 4 Sekunden: +25 Punkte
  - Unter 6 Sekunden: +10 Punkte
- **Streak-Bonus**: Ab 3er Streak → Multiplikator (x1.5, x2, x2.5, max x3)
- **Abzug bei Fehler**: Kein Punktabzug (soll motivieren, nicht bestrafen!)

## Puzzle-Belohnungssystem

- Jedes Puzzle besteht aus **9 Teilen** (3x3 Grid)
- Alle **10 richtige Antworten** → 1 Puzzleteil
- Wenn alle 9 Teile gesammelt → Bild wird enthullt mit Animation
- **Bilder**: Einfache, kindgerechte SVG-Illustrationen (Einhorn, Hund, Katze, Regenbogen, Rakete, Delfin)
- Puzzleteile werden als farbige Rechtecke angezeigt, die sich beim Sammeln in das Bild verwandeln
- Fortschrittsanzeige: "3/9 Puzzleteile"

## Visuelles Design

- **Farbschema**: Bunt, kindgerecht, hoher Kontrast
- **Silben-Kacheln**: Abgerundete Rechtecke, verschiedene Pastellfarben, grosse Schrift (mind. 24px)
- **Schriftart**: Gut lesbare Schrift (z.B. Comic Neue oder system sans-serif, extra gross)
- **Animationen**:
  - Richtig: Kachel leuchtet gruen, kurzer Huepf-Effekt, Konfetti
  - Falsch: Sanftes Wackeln, Kachel wird kurz rot
  - Level-Up: Grosser Stern mit "Super! Naechstes Level!" Text
  - Puzzleteil: Fliegt von der Mitte ins Puzzle-Fenster
- **Responsive**: Funktioniert auf Desktop, Tablet und grossem Handy
- **Lautsprechersymbol**: Zum nochmaligen Abspielen der Silbe

## Sprachausgabe (Web Speech API)

- Nutzt `window.speechSynthesis` mit deutscher Stimme
- Spricht die Ziel-Silbe/das Wort klar und langsam vor
- "Wiederhole" Button zum nochmaligen Anhoeren
- Bei Woertern (Level 4+): Spricht zuerst das ganze Wort, dann nochmal langsam silbenweise
- Fallback-Hinweis wenn keine deutsche Stimme verfuegbar

## Spielstand (LocalStorage)

Gespeichert wird:
- Aktuelles Level
- Gesamtpunkte
- Streak-Zaehler
- Gesammelte Puzzleteile + freigeschaltete Bilder
- "Schwierige Silben" Liste (die oft falsch waren)
- Statistiken (gespielte Runden, Trefferquote)

## Implementierungsreihenfolge

### Schritt 1: Grundgeruest
- `index.html` mit Basis-Layout (Header, Spielfeld, Footer)
- `style.css` mit Grid-Layout, Farben, Grundstyles
- Start-Screen mit "Spiel starten" Button

### Schritt 2: Silbendaten
- `syllables.js` mit kuratierten deutschen Silben fuer Level 1-4
- Level-Definitionen in `levels.js`

### Schritt 3: Kern-Spiellogik
- `game.js` mit Game Loop
- Silbenteppich rendern (Grid mit klickbaren Kacheln)
- Zufaellige Silben-Auswahl + Ziel bestimmen
- Klick-Handler mit richtig/falsch Logik

### Schritt 4: Sprachausgabe
- `speech.js` mit Web Speech API Integration
- Deutsche Stimme auswaehlen
- Silbe vorlesen + Wiederhole-Button

### Schritt 5: Adaptives System + Punkte
- Streak-Tracking
- Level-Up / Level-Down Logik
- Punkteberechnung mit Geschwindigkeitsbonus

### Schritt 6: Animationen & Feedback
- CSS Animationen (richtig/falsch)
- Konfetti-Effekt
- Level-Up Animation
- Ermutigende Nachrichten

### Schritt 7: Puzzle-Belohnungssystem
- `puzzle.js` mit Puzzle-Logik
- SVG-Bilder erstellen (einfache kindgerechte Motive)
- Puzzle-Fortschrittsanzeige
- Enthuellung-Animation

### Schritt 8: Spielstand & Persistenz
- `storage.js` mit LocalStorage Wrapper
- Automatisches Speichern
- Spielstand laden beim Oeffnen

### Schritt 9: Feinschliff
- Responsive Design testen
- Schwierige-Silben-Wiederholung
- Sound-Effekte (optional)
- Eltern-Bereich mit Statistiken (optional)

## Verifizierung / Testen

1. `index.html` im Browser oeffnen
2. Pruefen: Sprachausgabe funktioniert (deutsche Stimme)
3. Level 1 durchspielen: 5x richtig → Level-Up prufen
4. Absichtlich Fehler machen: 3x falsch → Level-Down pruefen
5. Punkte-System: Schnell vs. langsam klicken, Bonus pruefen
6. Puzzleteile: 10 richtige Antworten → Puzzleteil erscheint
7. Browser schliessen und oeffnen → Spielstand geladen
8. Auf verschiedenen Bildschirmgroessen testen
