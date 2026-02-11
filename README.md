# S&P 500 Constellation Terminal

Interaktywna wizualizacja wszystkich 503 spółek indeksu S&P 500 w formie grafu konstelacji, z estetyką retro inspirowaną Windows 98.

## 🌐 Demo Online

> **🌐 Live Demo:** [melodious-phoenix-660ab6.netlify.app](https://melodious-phoenix-660ab6.netlify.app)
>
> **GitHub:** [w69981/sp500-constellation-terminal](https://github.com/w69981/sp500-constellation-terminal)

Aplikacja działa w pełni bez backendu — w trybie offline wyświetla wszystkie 503 spółki S&P 500 z wbudowanymi danymi rynkowymi.

---

## 🚀 Instrukcja Instalacji i Uruchomienia

### Wymagania systemowe
- **Node.js** 18+ i **npm** 9+
- **Python** 3.9+ *(opcjonalnie, tylko dla live danych)*

### Opcja 1: Tylko Frontend (tryb offline — 503 spółek)

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/w69981/sp500-constellation-terminal.git
cd sp500-constellation-terminal

# 2. Zainstaluj zależności frontendu
cd frontend
npm install

# 3. Uruchom serwer deweloperski
npm run dev
```

Otwórz **http://localhost:5173** — aplikacja uruchomi się z wbudowanymi danymi 503 spółek (tryb offline).

### Opcja 2: Pełna wersja z live danymi (Backend + Frontend)

#### 1. Backend (Python/FastAPI)
```bash
# Z katalogu głównego projektu:
pip3 install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```
Backend pobierze listę S&P 500 z Wikipedia, ceny z Yahoo Finance i uruchomi API na porcie 8000.

#### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

#### 3. Otwórz przeglądarkę
- **Frontend:** http://localhost:5173 (automatycznie połączy się z backendem)
- **API Docs (Swagger):** http://localhost:8000/docs

### Zmienne środowiskowe

| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `VITE_API_URL` | URL backendu API | `http://localhost:8000` |

Plik `.env` w katalogu `frontend/` pozwala nadpisać domyślny URL backendu.

---

## 📋 Funkcjonalności

- **Interaktywny graf konstelacji** — 503 spółki S&P 500 jako węzły na grafie siłowym
- **Dane live z Yahoo Finance** — aktualne ceny, kapitalizacja, zmiana procentowa (z backendem)
- **Tryb offline** — 503 spółki z wbudowanymi danymi gdy backend niedostępny
- **Filtrowanie po sektorach GICS** — 11 sektorów z dynamiczną aktualizacją
- **Szczegóły akcji na hover** — panel STOCK DETAIL z ceną, zmianą, kapitalizacją, wagą
- **Top Gainers / Top Losers** — ranking najlepszych i najgorszych akcji
- **Zoom i przeciąganie** — nawigacja po grafie z przybliżaniem i przesuwaniem
- **Responsywny design** — mobile drawer, tablet i desktop layout
- **Estetyka retro** — CRT scanlines, fonty VT323 i Press Start 2P, Windows 98 UI
- **Deployment na Netlify** — automatyczny deploy z brancha `main`

---

## 🛠️ Technologie

### Backend
| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| **Python** | 3.9+ | Język programowania |
| **FastAPI** | 0.109.0 | Framework API REST |
| **yfinance** | 0.2.36 | Pobieranie danych giełdowych z Yahoo Finance |
| **pandas** | 2.2.0 | Przetwarzanie danych tabelarycznych (parsowanie Wikipedia) |
| **uvicorn** | 0.27.0 | Serwer ASGI |

### Frontend
| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| **React** | 19.2.0 | Biblioteka UI |
| **Vite** | 7.2.4 | Bundler i dev server |
| **react-force-graph-2d** | 1.29.0 | Wizualizacja grafu konstelacji (Canvas/WebGL) |
| **d3-force** | 3.0.0 | Algorytm sił fizycznych dla grafu |
| **Tailwind CSS** | 4.1.18 | Framework CSS |
| **Google Fonts** | - | VT323, Press Start 2P (retro typography) |

### Hosting / Deploy
| Technologia | Zastosowanie |
|-------------|--------------|
| **Netlify** | Hosting frontendu (static site) |
| **Git / GitHub** | Kontrola wersji, CI/CD |

---

## 📁 Struktura projektu

```
projekt/
├── .gitignore              # Pliki ignorowane przez Git
├── main.py                 # Backend FastAPI (310 LOC)
├── requirements.txt        # Zależności Python
├── vercel.json             # Konfiguracja Vercel (alternatywny deploy)
├── netlify.toml            # Konfiguracja Netlify (aktualny deploy)
├── sp500_full_cache.json   # Cache danych (503 spółki, ~80KB)
├── README.md               # Ten plik
├── api/                    # Serverless API functions (Vercel)
│   ├── stocks.py           # Endpoint: lista wszystkich akcji
│   ├── stock.py            # Endpoint: szczegóły jednej akcji
│   └── health.py           # Endpoint: health check
├── docs/
│   ├── TECHNICAL.md        # Dokumentacja techniczna
│   ├── USER_GUIDE.md       # Podręcznik użytkownika
│   └── DEVELOPMENT.md      # Dokumentacja procesu powstawania
└── frontend/
    ├── .env                # Zmienne środowiskowe (VITE_API_URL)
    ├── package.json        # Zależności Node.js
    ├── vite.config.js      # Konfiguracja Vite + Tailwind
    ├── index.html          # HTML z SEO meta tags i Google Fonts
    └── src/
        ├── main.jsx        # Entry point React
        ├── App.jsx         # Główny komponent (497 LOC)
        ├── index.css       # Style retro (406 LOC)
        ├── data/
        │   └── fallbackData.js  # Wbudowane dane offline (503 spółek)
        └── components/
            ├── RetroWindow.jsx        # Okno Windows 98 (draggable)
            └── ConstellationGraph.jsx # Graf D3.js force-directed
```

---

## 🌐 Hosting (Netlify)

Aplikacja jest wdrożona na Netlify z automatycznym deploy z GitHub.

### Konfiguracja (`netlify.toml`)
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA fallback:** Redirect `/*` → `/index.html`

Każdy push na branch `main` automatycznie triggeruje nowy deploy na Netlify.

---

## 📚 Dokumentacja

- [Dokumentacja techniczna](docs/TECHNICAL.md) — architektura, API, technologie
- [Podręcznik użytkownika](docs/USER_GUIDE.md) — przykłady użycia, interfejs
- [Dokumentacja procesu](docs/DEVELOPMENT.md) — harmonogram, estymacja, decyzje

---

## 👨‍💻 Autor

Adrian Kopiec

## 📄 Licencja

MIT License
