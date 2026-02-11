# S&P 500 Constellation Terminal

Interaktywna wizualizacja wszystkich 500+ spółek indeksu S&P 500 w formie konstelacji, z estetyką retro inspirowaną Windows 98.

## 🌐 Demo Online

> **Vercel:** [Link do demo](https://sp500-constellation-terminal.vercel.app) *(uzupełnij po deployment)*
>
> **GitHub:** [w69981/sp500-constellation-terminal](https://github.com/w69981/sp500-constellation-terminal)

Aplikacja działa w pełni bez backendu — w trybie offline wyświetla 50 największych spółek z danymi z cache.

---

## 🚀 Szybki start

### Opcja 1: Tylko Frontend (bez backendu)

```bash
cd frontend
npm install
npm run dev
```

Otwórz http://localhost:5173 — aplikacja uruchomi się z wbudowanymi danymi (50 spółek).

### Opcja 2: Pełna wersja (z backendem)

#### Wymagania
- Python 3.9+
- Node.js 18+
- npm 9+

#### 1. Backend (Python/FastAPI)
```bash
pip3 install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

#### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

#### 3. Otwórz przeglądarkę
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

---

## 📋 Funkcjonalności

- **Interaktywny graf konstelacji** — 500+ spółek jako węzły connected by constellation lines
- **Filtrowanie po sektorach** — 11 sektorów GICS z live updates
- **Szczegóły akcji na hover** — cena, zmiana, kapitalizacja, waga w indeksie
- **Zoom i przeciąganie** — nawigacja po grafie D3.js force-directed
- **Responsywny design** — mobile drawer z panelami, tablet i desktop layout
- **Tryb offline** — fallback data gdy backend niedostępny
- **Estetyka retro** — CRT scanlines, piksele VT323, Windows 98 UI
- **Dane live** — real-time z Yahoo Finance (gdy dostępne)

---

## 🛠️ Technologie

### Backend
| Technologia | Zastosowanie |
|-------------|-------------|
| **FastAPI** | Framework API REST |
| **yfinance** | Dane giełdowe (Yahoo Finance) |
| **pandas** | Przetwarzanie danych tabelarycznych |
| **uvicorn** | Serwer ASGI |

### Frontend
| Technologia | Zastosowanie |
|-------------|-------------|
| **React 19** | Biblioteka UI |
| **Vite 7** | Bundler i dev server |
| **D3.js / react-force-graph** | Wizualizacja grafu konstelacji |
| **TailwindCSS 4** | Utility-first CSS framework |
| **Google Fonts** | VT323, Press Start 2P (retro typography) |

---

## 📁 Struktura projektu

```
projekt/
├── .gitignore              # Pliki ignorowane przez Git
├── main.py                 # Backend FastAPI (API REST)
├── requirements.txt        # Zależności Python
├── README.md               # Ten plik
├── docs/
│   ├── TECHNICAL.md        # Dokumentacja techniczna
│   ├── USER_GUIDE.md       # Podręcznik użytkownika
│   └── DEVELOPMENT.md      # Dokumentacja procesu
└── frontend/
    ├── vercel.json         # Konfiguracja Vercel
    ├── package.json        # Zależności Node.js
    ├── vite.config.js      # Konfiguracja Vite
    ├── index.html          # HTML z SEO meta tags
    └── src/
        ├── main.jsx        # Entry point React
        ├── App.jsx         # Główny komponent (state, layout)
        ├── index.css       # Style (retro design system)
        ├── data/
        │   └── fallbackData.js  # Dane offline (50 spółek)
        └── components/
            ├── RetroWindow.jsx        # Okno Windows 98
            └── ConstellationGraph.jsx # Graf D3.js
```

---

## 🌐 Hosting (Vercel)

### Deploy na Vercel

1. Push do GitHub
2. Importuj repo w [vercel.com](https://vercel.com)
3. Ustaw **Root Directory** na `frontend`
4. Vercel automatycznie wykryje Vite i skonfiguruje build
5. Gotowe — frontend działa w trybie offline z wbudowanymi danymi

### Zmienne środowiskowe (opcjonalne)
| Zmienna | Opis | Domyślnie |
|---------|------|-----------|
| `VITE_API_URL` | URL backendu | `http://localhost:8000` |

---

## 📚 Dokumentacja

- [Dokumentacja techniczna](docs/TECHNICAL.md)
- [Podręcznik użytkownika](docs/USER_GUIDE.md)
- [Dokumentacja procesu](docs/DEVELOPMENT.md)

---

## 👨‍💻 Autor

Adrian Kopiec

## 📄 Licencja

MIT License
