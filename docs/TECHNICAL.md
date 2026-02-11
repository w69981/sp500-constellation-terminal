# Dokumentacja Techniczna

## S&P 500 Constellation Terminal

---

## 1. Przegląd Systemu

Aplikacja składa się z dwóch warstw:
- **Backend** - API REST zbudowane w FastAPI (Python)
- **Frontend** - SPA zbudowane w React z wizualizacją D3.js

### Diagram Architektury

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │   App.jsx   │  │ RetroWindow  │  │  ConstellationGraph    │  │
│  │  (główny)   │  │ (UI okna)    │  │  (wizualizacja D3.js)  │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (FastAPI)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │   main.py   │  │    Cache     │  │      yfinance          │  │
│  │ (endpoints) │  │  (JSON file) │  │   (dane giełdowe)      │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               ZEWNĘTRZNE ŹRÓDŁA DANYCH                           │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  Wikipedia S&P 500  │  │     Yahoo Finance API           │   │
│  │  (lista spółek)     │  │     (ceny akcji)                │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Wykorzystane Technologie i Biblioteki

### 2.1 Backend (Python)

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| FastAPI | 0.109.0 | Framework API REST |
| uvicorn | 0.27.0 | Serwer ASGI |
| yfinance | 1.1.0 | Pobieranie danych giełdowych |
| pandas | 2.2.0 | Przetwarzanie danych tabelarycznych |
| Python | 3.9+ | Język programowania |

**Plik requirements.txt:**
```
fastapi==0.109.0
uvicorn==0.27.0
yfinance==0.2.36
pandas==2.2.0
```

### 2.2 Frontend (JavaScript/React)

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| React | 18.x | Biblioteka UI |
| Vite | 7.x | Bundler i dev server |
| react-force-graph-2d | - | Wizualizacja odsetek siłowych |
| D3.js | 7.x | Biblioteka wizualizacji |
| CSS3 | - | Stylowanie (retro aesthetic) |

**Główne zależności (package.json):**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-force-graph-2d": "^1.25.0"
  }
}
```

---

## 3. Architektura Aplikacji

### 3.1 Warstwa Backendu

#### Struktura plików
```
main.py
├── fetch_sp500_from_wikipedia()  # Pobieranie listy S&P 500
├── get_fallback_companies()       # Dane awaryjne
├── generate_stock_data()          # Generowanie danych z cenami
├── load_or_create_cache()         # Zarządzanie cache
└── Endpoints API
    ├── GET /
    ├── GET /api/stocks
    ├── GET /api/stock/{ticker}
    ├── GET /api/health
    └── POST /api/refresh
```

#### Przepływ danych
1. Przy starcie serwera: `load_or_create_cache()`
2. Jeśli brak cache → `fetch_sp500_from_wikipedia()` + `generate_stock_data()`
3. Dane zapisywane do `sp500_full_cache.json`
4. Kolejne requesty serwowane z pamięci (`SP500_DATA`)

### 3.2 Warstwa Frontendu

#### Struktura komponentów
```
App.jsx (główny kontener)
├── ConstellationGraph.jsx  # Graf D3.js force-directed
├── RetroWindow.jsx         # Okno w stylu Windows 98
└── Panele informacyjne
    ├── MARKET DATA         # Statystyki rynkowe
    ├── SECTOR FILTER       # Filtr sektorów
    ├── STOCK DETAIL        # Szczegóły akcji
    ├── TOP GAINERS         # Najlepsze wyniki
    ├── TOP LOSERS          # Najgorsze wyniki
    └── LEGEND              # Legenda
```

#### Stan aplikacji (React hooks)
```javascript
const [stocks, setStocks] = useState([]);      // Dane akcji
const [loading, setLoading] = useState(true);  // Stan ładowania
const [sectorFilter, setSectorFilter] = useState('All'); // Filtr
const [hoveredStock, setHoveredStock] = useState(null);  // Hover
```

---

## 4. API Endpoints

### 4.1 GET /
**Opis:** Status serwera

**Response:**
```json
{
  "message": "S&P 500 API",
  "stocks": 503
}
```

---

### 4.2 GET /api/stocks
**Opis:** Lista wszystkich akcji S&P 500

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "sector": "Information Technology",
      "market_cap": 3200000000000,
      "price": 278.00,
      "change_percent": 1.23,
      "weight": 5.1234
    }
    // ... więcej akcji
  ],
  "count": 503,
  "last_updated": "2026-02-08T22:00:00.000Z"
}
```

**Pola obiektu stock:**

| Pole | Typ | Opis |
|------|-----|------|
| ticker | string | Symbol giełdowy |
| name | string | Nazwa spółki |
| sector | string | Sektor GICS |
| market_cap | number | Kapitalizacja rynkowa (USD) |
| price | number | Cena akcji (USD) |
| change_percent | number | Zmiana procentowa |
| weight | number | Waga w indeksie (%) |

---

### 4.3 GET /api/stock/{ticker}
**Opis:** Szczegóły pojedynczej akcji z danymi live

**Parametry URL:**
| Parametr | Typ | Opis |
|----------|-----|------|
| ticker | string | Symbol giełdowy (np. AAPL) |

**Response (sukces):**
```json
{
  "success": true,
  "stock": {
    "ticker": "AAPL",
    "price": 278.00,
    "change_percent": 1.23,
    "market_cap": 3200000000000,
    "is_live": true
  },
  "source": "live"
}
```

**Źródła danych:**
- `live` - dane z Yahoo Finance (real-time)
- `cache` - dane z cache (1 min)
- `fallback` - dane z głównej listy

---

### 4.4 GET /api/health
**Opis:** Health check API

**Response:**
```json
{
  "status": "ok",
  "stocks": 503
}
```

---

### 4.5 POST /api/refresh
**Opis:** Odświeżenie danych z Wikipedia

**Response:**
```json
{
  "success": true,
  "count": 503
}
```

---

## 5. Struktura Cache (JSON)

Plik: `sp500_full_cache.json`

```json
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "sector": "Information Technology",
      "market_cap": 3200000000000,
      "price": 278.00,
      "change_percent": 1.23,
      "weight": 5.1234
    }
  ],
  "updated": "2026-02-08T22:00:00.000000"
}
```

**Strategia cache:**
- Cache ładowany przy starcie serwera
- Cache zapisywany po pobraniu świeżych danych
- Minimalny rozmiar: 400 akcji (walidacja)
- Brak TTL - dane odświeżane manualnie lub przy restarcie

---

## 6. Sektory GICS

Aplikacja używa 11 sektorów zgodnie ze standardem GICS:

| Sektor | Liczba spółek (przybliżona) |
|--------|----------------------------|
| Information Technology | ~70 |
| Health Care | ~60 |
| Financials | ~65 |
| Consumer Discretionary | ~50 |
| Communication Services | ~25 |
| Industrials | ~75 |
| Consumer Staples | ~35 |
| Energy | ~20 |
| Utilities | ~30 |
| Real Estate | ~30 |
| Materials | ~25 |

---

## 7. Obsługa Błędów

### Backend
- Wikipedia niedostępna → `get_fallback_companies()` (10 głównych spółek + wygenerowane)
- Yahoo Finance niedostępne → Hardcoded prawdziwe ceny dla ~95 głównych spółek
- Nieznany ticker → HTTP 404 z błędem

### Frontend
- Błąd fetch → Wyświetlenie komunikatu błędu
- Brak danych → Stan loading
- Offline → Ostatnie załadowane dane

---

## 8. Wydajność

### Optymalizacje
1. **Cache danych** - jednokrotne pobieranie przy starcie
2. **Lazy loading cen live** - fetch tylko na hover
3. **Memoizacja filtrów** - React.useMemo dla filtrowanych danych
4. **WebGL rendering** - react-force-graph używa Canvas/WebGL

### Metryki
- Czas startu backendu: ~2-5s (z cache), ~10-30s (bez cache)
- Czas ładowania frontendu: <500ms
- Rozmiar bundle: ~200KB (gzipped)

---

## 9. Bezpieczeństwo

- **CORS** - skonfigurowane dla wszystkich origins (development)
- **Brak autentykacji** - publiczne API (tylko odczyt)
- **Rate limiting Yahoo** - wbudowane w yfinance
- **Walidacja danych** - sanityzacja tickerów

---

## 10. Rozwój i Rozszerzenia

### Możliwe rozszerzenia:
1. Autentykacja użytkowników
2. Portfolio tracking
3. Alerty cenowe
4. Historyczne wykresy
5. Więcej indeksów (DAX, FTSE, Nikkei)
6. WebSocket dla real-time updates
