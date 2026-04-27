# 📱 GSD aufs Android-Handy bringen

Drei Wege, sortiert nach Aufwand. Der **mittlere Weg (PWA via Vercel oder GitHub Pages)** ist für 95% der Leute der Sweet Spot.

> 📖 **Für GitHub Pages:** siehe `GITHUB_DEPLOY.md` — das ist der wahrscheinlich bequemste Weg, weil dein Code eh in Git liegt und sich automatisch bei jedem Push neu baut.

---

## 🟢 Weg 1 — Quick & Dirty: Lokal testen (5 Min)

Funktioniert nur solange dein Laptop läuft und im gleichen WLAN.

```bash
cd gsd-app
npm install
npm run dev
```

Vite zeigt dir eine `Network: http://192.168.x.x:5173` URL. Diese URL im Chrome aufm Handy aufrufen → "Zum Startbildschirm hinzufügen" → fertig.

**Limit:** Geht nur wenn dein Rechner an ist. Nichts für den Alltag.

---

## 🟡 Weg 2 — PWA online hosten (15 Min, EMPFOHLEN)

Deine App liegt auf einem kostenlosen Server, du rufst sie aufm Handy einmalig auf, machst "Zum Startbildschirm" → fertig. Sieht aus und fühlt sich an wie eine App. Kein Android Studio, kein APK-Geraffel.

### Setup mit Vercel (gratis)

1. Gratis-Account auf https://vercel.com (mit GitHub-Login geht's am schnellsten)
2. Projekt bauen lokal:
   ```bash
   cd gsd-app
   npm install
   npm run build
   ```
   Das erzeugt einen `dist/` Ordner.
3. Vercel CLI installieren und deployen:
   ```bash
   npm install -g vercel
   vercel
   ```
   Folge den Fragen (alle Defaults sind OK). Am Ende kriegst du eine URL wie `https://gsd-app-xyz.vercel.app`.
4. Diese URL aufm Handy in Chrome aufrufen → Menü → "Zur Startseite hinzufügen" → die App liegt als Icon mit Splash auf deinem Homescreen, startet im Vollbild ohne Browser-UI.

**Updaten:** Code ändern → `npm run build && vercel --prod` → Handy zieht neue Version automatisch.

**Vorteile:** Sofort verfügbar, keine native Toolchain, läuft auch offline (deine Daten via localStorage), updatet sich von selbst.
**Limit:** Keine Hintergrund-Notifications. Wenn die App geschlossen ist, kommen keine Reminder.

---

## 🔴 Weg 3 — Echte APK mit Capacitor (1-3h beim ersten Mal)

Native Android-App, eigenes Icon, kann auch im Hintergrund Notifications schicken (mit Plugin), kann irgendwann sogar in den Play Store. Aber: **du musst Android Studio installieren** (ca. 3-4 GB Download).

### Was du brauchst (alle gratis)

- **Node.js** ≥ 18 — https://nodejs.org
- **Java JDK 17** — https://adoptium.net (Temurin 17 LTS)
- **Android Studio** — https://developer.android.com/studio (lädt beim Setup das Android SDK selbst nach)

Nach Installation einmal Android Studio öffnen, durch den ersten Setup-Wizard klicken — der lädt die SDK-Tools automatisch. Beenden, weiter mit dem Terminal.

### Schritt 1: Capacitor initialisieren

```bash
cd gsd-app
npm install
npm run android:init
```

Das letzte Kommando macht: `npm run build` (Vite baut alles in `dist/`) → `cap add android` (legt einen `android/` Ordner mit dem nativen Wrapper an).

### Schritt 2: App-Icon einbauen

Eine fertige `resources/icon.png` (1024×1024) liegt schon drin. Mit dem `@capacitor/assets` Tool generierst du in einem Rutsch alle benötigten Größen:

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate --android
```

Das Tool nimmt `resources/icon.png` und `resources/splash.png`, schreibt alle nötigen mipmap-Varianten direkt in `android/app/src/main/res/`. Perfekte Icons für jede Bildschirmdichte.

### Schritt 3: APK bauen

```bash
npm run android:open
```

Das Kommando baut die Web-App neu, syncht alles in den Android-Ordner und öffnet **Android Studio**. Erste Mal dauert's, weil Android Studio Gradle und alle Dependencies runterlädt (~10-15 Min, einmalig).

In Android Studio oben:
- Menü **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Unten rechts erscheint nach 1-2 Min die Meldung "APK(s) generated successfully" → **locate** klicken
- Die fertige Datei heißt `app-debug.apk` und liegt in `android/app/build/outputs/apk/debug/`

### Schritt 4: APK aufs Handy

**Variante A — USB:**
1. Aufm Handy: Einstellungen → Über das Telefon → 7× auf "Build-Nummer" tippen → "Entwickleroptionen" sind aktiviert
2. In den Entwickleroptionen: USB-Debugging an
3. Per USB ans Notebook anstecken, Handy fragt "USB-Debugging zulassen?" → ja
4. In Android Studio oben in der Geräte-Liste dein Handy auswählen → ▶ Run-Button → die App wird drauf installiert und gestartet

**Variante B — APK rüberkopieren:**
1. Die `app-debug.apk` per USB / Telegram / Google Drive aufs Handy schaufeln
2. Im Datei-Explorer aufm Handy auf die APK tippen
3. "Installation aus unbekannten Quellen erlauben" akzeptieren
4. Installieren → fertig, App-Icon liegt im App-Drawer

### Updates machen

Bei jeder Code-Änderung:

```bash
npm run android:sync
```

Dann in Android Studio wieder Build → APK. Oder mit angeschlossenem Handy einfach auf ▶ Run klicken.

---

## ⚖️ Welcher Weg für wen?

| Du willst...                                  | Nimm...     |
|-----------------------------------------------|-------------|
| In 5 Min was sehen, kurz testen              | Weg 1       |
| Die App täglich nutzen, läuft offline         | **Weg 2**   |
| Eigenes Icon im App-Drawer, später Play Store | Weg 3       |
| Hintergrund-Notifications                     | Weg 3 + Plugin |

---

## 🐛 Troubleshooting

**`npm install` Fehler "permission denied"** — auf Mac/Linux mit `sudo` oder NVM den Node-Path fixen.

**Vite Network-URL nicht erreichbar** — Firewall blockt Port 5173. Windows-Defender oder Mac-Firewall kurz Port 5173 freigeben. Handy + Rechner müssen im gleichen WLAN sein, kein Gast-Netz.

**Android Studio: "Gradle sync failed"** — meist falsche Java-Version. Capacitor 6 will JDK 17. Check mit `java -version`. Falls 11 oder 21 → JDK 17 von Adoptium installieren und in Android Studio unter Settings → Build Tools → Gradle den JDK-Pfad setzen.

**APK installiert sich nicht ("App nicht installiert")** — meist konkurrierende Signaturen. Wenn du vorher schon eine andere APK mit gleichem `appId` (`com.gsd.app`) drauf hattest, erst deinstallieren.

**Vercel: nichts zu sehen** — `npm run build` muss vorher lokal funktionieren. Falls Build-Fehler: Logs lesen. Meistens fehlt `dist/` oder Vite-Config-Pfad falsch.

**localStorage leer auf Capacitor-APK** — Capacitor isoliert Storage pro App. Die APK hat ihren eigenen leeren Storage, deine Browser-Daten kommen nicht mit. Wenn du Daten migrieren willst: in Settings → Backup exportieren → ins APK importieren.

---

## 📦 Was im ZIP drin ist

```
gsd-app/
├── App.jsx              ← die ganze App-Logik
├── main.jsx             ← Vite Entry
├── index.html           ← HTML-Hülle
├── package.json         ← npm dependencies
├── vite.config.js       ← Vite-Config
├── capacitor.config.json← Capacitor-Config (für Weg 3)
├── public/
│   ├── bg-pattern.jpeg  ← Kackhaufen-Hintergrund
│   ├── poo-splash.png   ← Splash-Charakter
│   ├── poo-1.png ... poo-4.png  ← Celebration-Animationen
│   ├── icon-192.png, icon-512.png ← PWA-Icons
│   └── manifest.json    ← PWA-Manifest
└── resources/
    ├── icon.png         ← 1024px Master-Icon für Capacitor
    └── splash.png       ← 1024px Splash-Image für Capacitor
```

Viel Spaß. 💩⚡
