# 🐙 GSD via GitHub auf dein Handy

GitHub hostet deine App **kostenlos und permanent**. Du committest, GitHub baut die App automatisch und stellt sie unter einer URL bereit. Aufm Handy einmal "Zum Startbildschirm hinzufügen" → läuft.

## Was du brauchst

- Einen GitHub-Account (gratis: https://github.com/signup)
- **Git** auf deinem Rechner installiert (https://git-scm.com)
- **Node.js** installiert (https://nodejs.org)

## Schritt 1: Repo auf GitHub anlegen

1. Auf https://github.com/new
2. Repository name: z.B. `gsd-app` (merk dir den Namen — der wird Teil der URL)
3. **Public** wählen (für Private brauchst du ein bezahltes Pages-Setup)
4. NICHT "Initialize with README" anhaken
5. Create repository → GitHub zeigt dir Anweisungen, ignorier sie und mach unten weiter

## Schritt 2: Code hochladen

Im entpackten `gsd-app/` Ordner im Terminal:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/gsd-app.git
git push -u origin main
```

(Beim ersten `push` will Git deinen GitHub-Login. Falls's hakt: GitHub will mittlerweile **Personal Access Token** statt Passwort — anlegen unter https://github.com/settings/tokens, Scope `repo` reicht, Token als Passwort verwenden.)

## Schritt 3: Pages aktivieren

Auf GitHub → dein Repo → **Settings** (oben rechts) → links unten **Pages**.

Bei **Source** auswählen: **GitHub Actions**.

Speichern. Das war's an Konfiguration.

## Schritt 4: Workflow checken

Klick oben aufm Repo den **Actions**-Tab. Du siehst deinen ersten Build "Deploy to GitHub Pages" laufen (1-2 Min). Wenn der grün ist, ist deine App live unter:

```
https://DEIN-USERNAME.github.io/gsd-app/
```

(falls du das Repo `gsd-app` genannt hast).

## Schritt 5: Aufs Handy

URL aufm Handy in Chrome aufrufen → Menü (⋮) → **Zum Startbildschirm hinzufügen** → fertig. App-Icon auf dem Homescreen, startet im Vollbild ohne Browser-UI.

## Schritt 6: Updates

Code lokal ändern, dann:

```bash
git add .
git commit -m "Was du geändert hast"
git push
```

GitHub baut innerhalb von 1-2 Min automatisch die neue Version. Beim nächsten Öffnen aufm Handy ist sie da. (Manchmal Cache leeren / App neu installieren für sofortigen Effekt.)

---

## 🐛 Troubleshooting

**Build-Fehler in GitHub Actions** — Klick im Actions-Tab auf den roten Run, lies den Log. Meist Tippfehler oder fehlende Dependency. Behebung: lokal `npm run build` versuchen und checken dass es lokal grün ist, dann pushen.

**App lädt aber Bilder fehlen / weißer Bildschirm** — Repo wurde umbenannt nach dem ersten Build, oder Vite-`base` stimmt nicht. Im `.github/workflows/deploy.yml` ist `BASE_PATH: /${{ github.event.repository.name }}/` — das nimmt automatisch den Repo-Namen. Wenn du Custom-Domain nutzt, ändere das auf `/`.

**404 bei Aufruf** — Pages braucht 1-2 Min beim ersten Mal. Falls's nach 5 Min immer noch nicht geht: Settings → Pages → unter "Your site is live at" sollte die URL stehen. Wenn nicht, Workflow nochmal manuell triggern (Actions → Deploy → Run workflow).

**App-Updates kommen nicht aufm Handy** — PWA cached aggressiv. App vom Homescreen löschen, in Chrome aufm Handy History/Cache für die Site löschen, Seite neu öffnen, wieder zum Homescreen hinzufügen.

**Push verlangt Username/Passwort und akzeptiert nichts** — GitHub akzeptiert seit 2021 keine Passwörter mehr für Git. Personal Access Token erstellen: https://github.com/settings/tokens → Generate new token (classic) → Scope `repo` anhaken → kopieren → als "Passwort" beim Push eingeben. Token wird im OS-Keychain gespeichert, musst du nur einmal eingeben.

---

## ⚖️ Vergleich GitHub Pages vs. die anderen Wege

| Feature                        | GitHub Pages | Vercel  | Capacitor APK |
|--------------------------------|--------------|---------|---------------|
| Setup-Dauer beim ersten Mal    | ~15 Min      | ~10 Min | 1-3 h         |
| Permanente URL                 | ✅           | ✅      | ❌ (Datei)    |
| Auto-Deploy bei Code-Änderung  | ✅           | ✅      | ❌            |
| Eigenes App-Icon im App-Drawer | (nur via PWA)| (nur PWA)| ✅           |
| Hintergrund-Notifications      | ❌           | ❌      | ✅            |
| Funktioniert offline           | ✅ (LocalStorage) | ✅ | ✅           |
| Kostet was                     | Nein         | Nein    | Nein          |

GitHub Pages ist genauso schnell wie Vercel, aber dein Code liegt eh schon in Git — also warum nicht direkt von dort hosten lassen.
