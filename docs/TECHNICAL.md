# Dokumentacja Techniczna

## S&P 500 Constellation Terminal

---

## 1. Przegląd Systemu

Aplikacja składa się z dwóch warstw z trzema trybami pracy:

- **Backend** — API REST zbudowane w FastAPI (Python) z danymi live z Yahoo Finance
- **Frontend** — SPA zbudowane w React 19 z wizualizacją D3.js force-directed graph
- **Serverless API** — funkcje Python w katalogu `api/` kompatybilne z Vercel

### Tryby pracy

| Tryb | Backend | Dane | Opis |
|------|---------|------|------|
| **Live** | FastAPI na `:8000` | yfinance (real-time) | Pełna funkcjonalność z live cenami |
| **Serverless** | Vercel Functions | yfinance (on-demand) | Deploy na Vercel z API |
| **Offline** | Brak | 503 wbudowanych spółek | Statyczny frontend (Netlify) |

### Diagram Architektury

```
┌─────────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React 19 + Vite 7)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────────┐ │
│  │   App.jsx   │  │ RetroWindow  │  │   ConstellationGraph       │ │
│  │  (497 LOC)  │  │ (draggable)  │  │   (D3.js + Canvas)        │ │
│  └──────┬──────┘  └──────────────┘  └────────────────────────────┘ │
│         │                                                           │
│  ┌──────▼──────────────────────────────────────────────────────┐    │
│  │  fallbackData.js — 503 spółek S&P 500 (wbudowane dane)     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │ HTTP (fetch)
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌───────────┐  ┌───────────┐  ┌──────────────┐
        │ FastAPI   │  │ Vercel    │  │  Fallback    │
        │ :8000     │  │ Serverless│  │  (offline)   │
        │ (local)   │  │ Functions │  │  503 stocks  │
        └─────┬─────┘  └─────┬─────┘  └──────────────┘
              │               │
              ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ZEWNĘTRZNE ŹRÓDŁA DANYCH                         │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐  │
│  │  Wikipedia S&P 500      │  │     Yahoo Finance API           │  │
│  │  (lista 503 spółek)     │  │     (ceny akcji w real-time)    │  │
│  └─────────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Wykorzystane Technologie i Biblioteki

### 2.1 Backend (Python)

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| Python | 3.9+ | Język programowania |
| FastAPI | 0.109.0 | Framework API REST z automatyczną dokumentacją Swagger |
| uvicorn | 0.27.0 | Serwer ASGI (asynchroniczny) |
| yfinance | 0.2.36 | Pobieranie danych giełdowych z Yahoo Finance API |
| pandas | 2.2.0 | Przetwarzanie danych tabelarycznych (parsowanie HTML z Wikipedia) |

**Plik `requirements.txt`:**
```
fastapi==0.109.0
uvicorn==0.27.0
yfinance==0.2.36
pandas==2.2.0
```

### 2.2 Frontend (JavaScript/React)

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| React | 19.2.0 | Biblioteka UI (hooks-based) |
| React DOM | 19.2.0 | Renderer DOM |
| Vite | 7.2.4 | Bundler i dev server (HMR) |
| react-force-graph-2d | 1.29.0 | Wizualizacja grafu siłowego (Canvas/WebGL) |
| d3-force | 3.0.0 | Algorytm sił fizycznych dla grafu |
| Tailwind CSS | 4.1.18 | Framework CSS utility-first |
| Google Fonts | - | VT323 (monospace retro), Press Start 2P (pixel art) |

**Główne zależności (`package.json`):**
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "d3-force": "^3.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-force-graph-2d": "^1.29.0",
    "tailwindcss": "^4.1.18"
  }
}
```

### 2.3 Deployment / DevOps

| Technologia | Zastosowanie |
|-------------|--------------|
| Netlify | Hosting frontendu (static site, auto-deploy z GitHub) |
| Git / GitHub | Kontrola wersji, repozytorium kodu |
| Vercel *(alternatywny)* | Konfiguracja dla serverless deploy (`vercel.json`) |

---

## 3. Architektura Aplikacji

### 3.1 Warstwa Backendu (`main.py` — 310 LOC)

#### Struktura funkcji
```
main.py
├── REAL_PRICES{}               # Słownik ~95 głównych spółek z prawdziwymi cenami
├── fetch_sp500_from_wikipedia()  # Pobieranie listy S&P 500 z Wikipedia (pandas)
├── get_fallback_companies()      # 10 głównych spółek jako dane awaryjne
├── generate_stock_data()         # Generowanie danych z cenami live/fallback
├── load_or_create_cache()        # Zarządzanie cache JSON
├── startup_event()               # Inicjalizacja danych przy starcie
└── Endpoints API
    ├── GET  /                    # Status serwera
    ├── GET  /api/stocks          # Lista wszystkich akcji
    ├── GET  /api/stock/{ticker}  # Szczegóły pojedynczej akcji (live)
    ├── GET  /api/health          # Health check
    └── POST /api/refresh         # Odświeżenie danych z Wikipedia
```

#### Przepływ danych (startup)
1. `startup_event()` → wywołuje `load_or_create_cache()`
2. Jeśli istnieje `sp500_full_cache.json` z >= 400 akcji → ładuje z cache
3. Jeśli brak cache → `fetch_sp500_from_wikipedia()` → `generate_stock_data()`
4. Dane zapisywane do `SP500_DATA` (pamięć) + `sp500_full_cache.json` (dysk)

#### Przepływ danych (request `/api/stock/{ticker}`)
1. Próba pobrania live danych z yfinance (`yf.Ticker().fast_info`)
2. Jeśli sukces → zwraca `source: "live"`, `is_live: true`
3. Jeśli timeout/błąd → sprawdza `REAL_PRICES` fallback
4. Jeśli brak w fallback → szuka w głównej liście `SP500_DATA`

### 3.2 Serverless API (`api/` — 232 LOC)

Alternatywne endpointy dla deployment na Vercel (Python serverless functions):

| Plik | Endpoint | Opis |
|------|----------|------|
| `api/stocks.py` (127 LOC) | `GET /api/stocks` | Pobiera listę S&P 500 z Wikipedia, generuje dane |
| `api/stock.py` (90 LOC) | `GET /api/stock?ticker=AAPL` | Live dane z yfinance (query params) |
| `api/health.py` (15 LOC) | `GET /api/health` | Health check |

### 3.3 Warstwa Frontendu

#### Struktura komponentów
```
App.jsx (497 LOC) — główny kontener
├── ConstellationGraph.jsx (307 LOC) — graf D3.js force-directed
├── RetroWindow.jsx (90 LOC) — okno Windows 98 (draggable)
├── fallbackData.js (511 LOC) — 503 spółek wbudowanych
└── Panele informacyjne (renderowane w App.jsx)
    ├── MARKET DATA         # Total mcap, gainers/losers count
    ├── SECTOR FILTER       # 11 sektorów GICS (klikalne)
    ├── STOCK DETAIL        # Szczegóły akcji (na hover, live)
    ├── TOP GAINERS         # Top 9 wzrostów
    ├── TOP LOSERS          # Top 9 spadków
    └── LEGEND              # Legenda kolorów i rozmiarów
```

#### Stan aplikacji (React hooks w `App.jsx`)
```javascript
const [stocks, setStocks] = useState([]);         // Lista 503 akcji
const [loading, setLoading] = useState(true);     // Stan ładowania
const [sectorFilter, setSectorFilter] = useState('All'); // Filtr sektora
const [hoveredStock, setHoveredStock] = useState(null);  // Hover details
const [liveData, setLiveData] = useState(null);   // Live dane z yfinance
const [isOffline, setIsOffline] = useState(false); // Tryb offline
const [isMobile, setIsMobile] = useState(false);  // Detekcja mobile
const [drawerOpen, setDrawerOpen] = useState(false); // Mobile drawer
```

#### Strategia pobierania danych (multi-stage fetch)
```
1. Próba: fetch("/api/stocks")          ← Vercel serverless (relatywny URL)
   ↓ fail
2. Próba: fetch("localhost:8000/api/stocks") ← FastAPI lokal
   ↓ fail
3. Fallback: FALLBACK_STOCKS (503 spółek) ← Wbudowane dane
```

---

## 4. API Endpoints

### 4.1 `GET /`
**Opis:** Status serwera

**Response:**
```json
{
  "message": "S&P 500 API",
  "stocks": 503
}
```

---

### 4.2 `GET /api/stocks`
**Opis:** Lista wszystkich 503 akcji S&P 500

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "sector": "Information Technology",
      "market_cap": 4022528280029,
      "price": 273.68,
      "change_percent": 0.07,
      "weight": 6.42
    }
  ],
  "count": 503,
  "last_updated": "2026-02-11T00:22:00.000Z",
  "source": "cache"
}
```

**Pola obiektu stock:**

| Pole | Typ | Opis |
|------|-----|------|
| `ticker` | string | Symbol giełdowy (np. `AAPL`) |
| `name` | string | Pełna nazwa spółki |
| `sector` | string | Sektor GICS (11 kategorii) |
| `market_cap` | number | Kapitalizacja rynkowa w USD |
| `price` | number | Aktualna cena akcji w USD |
| `change_percent` | number | Zmiana procentowa (% dzienny) |
| `weight` | number | Waga w indeksie S&P 500 (%) |

---

### 4.3 `GET /api/stock/{ticker}`
**Opis:** Szczegóły pojedynczej akcji z danymi live z Yahoo Finance

**Parametry:**
| Parametr | Typ | Opis |
|----------|-----|------|
| `ticker` | string (path) | Symbol giełdowy (np. `AAPL`) |

**Response (sukces):**
```json
{
  "success": true,
  "stock": {
    "ticker": "AAPL",
    "price": 273.68,
    "change_percent": 0.07,
    "market_cap": 4022528280029,
    "is_live": true
  },
  "source": "live"
}
```

**Źródła danych (`source`):**
| Wartość | Opis |
|---------|------|
| `live` | Dane pobrane z Yahoo Finance w real-time |
| `cache` | Dane z cache yfinance (1 min TTL) |
| `fallback` | Dane z hardcoded `REAL_PRICES` lub głównej listy |

**Response (błąd — nieznany ticker):**
```json
{
  "success": false,
  "error": "Ticker 'XYZ' not found"
}
```

---

### 4.4 `GET /api/health`
**Opis:** Health check API

**Response:**
```json
{
  "status": "ok",
  "stocks": 503
}
```

---

### 4.5 `POST /api/refresh`
**Opis:** Ręczne odświeżenie danych — ponowne pobranie listy S&P 500 z Wikipedia i wygenerowanie cen.

**Response:**
```json
{
  "success": true,
  "count": 503
}
```

---

## 5. Struktura Cache (JSON)

Plik: `sp500_full_cache.json` (~80 KB)

```json
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "sector": "Information Technology",
      "market_cap": 4022528280029,
      "price": 273.68,
      "change_percent": 0.07,
      "weight": 6.42
    }
  ],
  "updated": "2026-02-11T00:22:00.000000"
}
```

**Strategia cache:**
- Cache ładowany przy starcie serwera (`startup_event`)
- Cache zapisywany po pobraniu świeżych danych z Wikipedia + yfinance
- Walidacja: minimalnie 400 akcji (poniżej → ponowne pobieranie)
- Brak automatycznego TTL — dane odświeżane przez `POST /api/refresh` lub restart serwera

**Uwaga:** Aplikacja NIE używa bazy danych. Cache JSON jest wystarczający dla danych tylko-do-odczytu.

---

## 6. Sektory GICS

Aplikacja używa 11 sektorów zgodnie ze standardem GICS (Global Industry Classification Standard):

| Sektor | Kolor w grafie | Przybliżona liczba spółek |
|--------|---------------|--------------------------|
| Information Technology | — | ~70 |
| Health Care | — | ~60 |
| Financials | — | ~65 |
| Consumer Discretionary | — | ~50 |
| Communication Services | — | ~25 |
| Industrials | — | ~75 |
| Consumer Staples | — | ~35 |
| Energy | — | ~20 |
| Utilities | — | ~30 |
| Real Estate | — | ~30 |
| Materials | — | ~25 |

---

## 7. Obsługa Błędów i Fallbacki

### Backend (wielowarstwowy fallback)
| Warstwa | Sytuacja | Fallback |
|---------|----------|----------|
| 1 | Wikipedia niedostępna | `get_fallback_companies()` — 10 głównych spółek |
| 2 | yfinance timeout | `REAL_PRICES` — hardcoded ceny ~95 spółek |
| 3 | Nieznany ticker | HTTP 404 z komunikatem błędu |
| 4 | Cache uszkodzony | Ponowne pobieranie danych |

### Frontend (kaskadowy fetch)
| Warstwa | Próba | Fallback |
|---------|-------|----------|
| 1 | `fetch("/api/stocks")` (Vercel) | → warstwa 2 |
| 2 | `fetch("localhost:8000/api/stocks")` | → warstwa 3 |
| 3 | `FALLBACK_STOCKS` (503 wbudowanych) | Banner "OFFLINE MODE" |

### Frontend (hover — live data)
| Warstwa | Próba | Fallback |
|---------|-------|----------|
| 1 | `fetch("/api/stock?ticker=X")` | → warstwa 2 |
| 2 | `fetch("localhost:8000/api/stock/X")` | → dane z listy stocks |

---

## 8. Wydajność i Optymalizacje

### Optymalizacje renderingu grafu
1. **Canvas/WebGL** — `react-force-graph-2d` używa Canvas zamiast SVG (krytyczne dla 503 węzłów)
2. **Pixel rendering** — węzły jako kwadraty (`fillRect`) zamiast okręgów (szybsze)
3. **Warunkowe etykiety** — tickery wyświetlane tylko dla dużych węzłów i przy odpowiednim zoomie
4. **Ograniczona liczba linków** — max 5 połączeń per sektor (uniknięcie O(n²))

### Optymalizacje danych
5. **Lazy loading cen live** — fetch yfinance tylko na hover (nie dla 503 akcji naraz)
6. **AbortSignal.timeout** — timeout 5s dla API, 8s dla yfinance
7. **Cache JSON** — jednorazowe pobieranie przy starcie (nie per-request)
8. **Memoizacja** — `useMemo` i `useCallback` dla filtrów i sortowania

### Metryki wydajności
| Metric | Wartość |
|--------|---------|
| Czas startu backendu (z cache) | ~2-3s |
| Czas startu backendu (bez cache) | ~15-30s |
| Czas ładowania frontendu (dev) | <500ms |
| Rozmiar fallbackData.js | ~75 KB |
| Renderowanie 503 węzłów (Canvas) | 60 FPS |

---

## 9. Bezpieczeństwo

- **CORS** — `allow_origins=["*"]` (publiczne API, tylko odczyt)
- **Brak autentykacji** — API publiczne, dane giełdowe publicznie dostępne
- **Rate limiting** — wbudowane w yfinance (Yahoo Finance limit)
- **Walidacja tickerów** — sanityzacja input w endpoint `/api/stock/{ticker}`
- **Brak bazy danych** — brak ryzyka SQL injection
- **Zmienne środowiskowe** — `VITE_API_URL` w `.env` (nie commitowany z wrażliwymi danymi)

---

## 10. Możliwe Rozszerzenia

1. WebSocket dla real-time price streaming
2. Portfolio tracking z localStorage
3. Alerty cenowe (push notifications)
4. Historyczne wykresy (candlestick charts)
5. Więcej indeksów (DAX, FTSE 100, Nikkei 225)
6. Testy jednostkowe (pytest + vitest)
7. CI/CD pipeline (GitHub Actions)
8. PWA dla pełnego offline mode z service worker
