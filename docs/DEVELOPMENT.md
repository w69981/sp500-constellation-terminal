# Dokumentacja Procesu Powstawania Projektu

## S&P 500 Constellation Terminal

---

## 1. Opis Projektu

### Cel
Stworzenie interaktywnej wizualizacji wszystkich 503 spółek indeksu S&P 500 w formie grafu konstelacji z estetyką retro inspirowaną Windows 98. Projekt łączy backend API (Python/FastAPI) z wykresem siłowym (React + D3.js), oferując zarówno dane live z Yahoo Finance jak i pełny tryb offline.

### Zakres
- Backend API do pobierania i cachowania danych giełdowych (503 spółki)
- Serverless API functions (Vercel-compatible) jako alternatywa
- Frontend SPA z interaktywnym grafem konstelacji (Canvas/WebGL)
- Wbudowane dane offline dla 503 spółek (tryb bez backendu)
- System cache JSON dla optymalizacji wydajności
- Responsywny interfejs z 6 panelami informacyjnymi
- Mobile drawer UI na urządzeniach < 768px
- Deployment na Netlify z auto-deploy z GitHub

---

## 2. Harmonogram Projektu

### Faza 1: Planowanie i Projektowanie (Dzień 1)
| Zadanie | Estymacja | Rzeczywistość | Status |
|---------|-----------|---------------|--------|
| Analiza wymagań i zakres projektu | 1h | 1h | ✅ Zakończone |
| Wybór stosu technologicznego | 0.5h | 0.5h | ✅ Zakończone |
| Projektowanie architektury (backend + frontend) | 1h | 1.5h | ✅ Zakończone |
| Projektowanie UI/UX (retro aesthetic) | 1h | 1h | ✅ Zakończone |

### Faza 2: Backend — FastAPI + yfinance (Dzień 1-2)
| Zadanie | Estymacja | Rzeczywistość | Status |
|---------|-----------|---------------|--------|
| Setup FastAPI + uvicorn | 0.5h | 0.5h | ✅ Zakończone |
| Integracja Wikipedia (pandas HTML parsing) | 2h | 2.5h | ✅ Zakończone |
| Integracja yfinance (live prices) | 2h | 3h | ✅ Zakończone |
| System cache JSON (sp500_full_cache.json) | 1h | 1h | ✅ Zakończone |
| Implementacja 5 endpointów REST | 1h | 1h | ✅ Zakończone |
| Hardcoded REAL_PRICES fallback (~95 spółek) | 1h | 1.5h | ✅ Zakończone |

### Faza 3: Frontend — React + D3.js (Dzień 2-3)
| Zadanie | Estymacja | Rzeczywistość | Status |
|---------|-----------|---------------|--------|
| Setup React 19 / Vite 7 / Tailwind CSS 4 | 0.5h | 0.5h | ✅ Zakończone |
| Design system retro (CSS, fonty, animacje) | 3h | 4h | ✅ Zakończone |
| Komponent ConstellationGraph (D3.js + Canvas) | 4h | 5h | ✅ Zakończone |
| Komponent RetroWindow (draggable) | 1h | 1h | ✅ Zakończone |
| 6 paneli informacyjnych w App.jsx | 2h | 2.5h | ✅ Zakończone |
| Integracja API + multi-stage fetch | 1h | 1.5h | ✅ Zakończone |
| fallbackData.js (503 spółek wbudowanych) | 1h | 1h | ✅ Zakończone |
| Responsywny layout + mobile drawer | 2h | 2h | ✅ Zakończone |

### Faza 4: Serverless API + Deploy (Dzień 3-4)
| Zadanie | Estymacja | Rzeczywistość | Status |
|---------|-----------|---------------|--------|
| Serverless functions (api/stocks.py, stock.py, health.py) | 1.5h | 2h | ✅ Zakończone |
| Konfiguracja Vercel (vercel.json) | 0.5h | 0.5h | ✅ Zakończone |
| Konfiguracja Netlify (netlify.toml) | 0.5h | 0.5h | ✅ Zakończone |
| Utworzenie GitHub repo + push kodu | 0.5h | 1h | ✅ Zakończone |
| Deployment na Netlify | 0.5h | 0.5h | ✅ Zakończone |

### Faza 5: Testowanie i Dokumentacja (Dzień 4)
| Zadanie | Estymacja | Rzeczywistość | Status |
|---------|-----------|---------------|--------|
| Testowanie funkcjonalne (API + frontend) | 2h | 2.5h | ✅ Zakończone |
| Testowanie offline mode (503 stocks) | 0.5h | 0.5h | ✅ Zakończone |
| Testowanie mobile responsywności | 1h | 1h | ✅ Zakończone |
| Naprawa błędów (hover, rendering, fetch) | 2h | 2h | ✅ Zakończone |
| Dokumentacja (README, TECHNICAL, USER_GUIDE, DEVELOPMENT) | 3h | 3h | ✅ Zakończone |

---

## 3. Estymacja Zadań

### Metoda szacowania
- **Podejście:** T-shirt sizing (S, M, L, XL)
- **Przelicznik:** S = 0.5-1h, M = 1-2h, L = 3-4h, XL = 5-8h

### Estymacja vs Rzeczywistość (podsumowanie)

| Komponent | Estymacja | Rzeczywistość | Różnica |
|-----------|-----------|---------------|---------|
| Planowanie | 3.5h | 4h | +14% |
| Backend API | 7.5h | 9.5h | +27% |
| Frontend SPA | 14.5h | 17.5h | +21% |
| Serverless + Deploy | 3.5h | 4.5h | +29% |
| Testowanie + Docs | 8.5h | 9h | +6% |
| **SUMA** | **37.5h** | **44.5h** | **+19%** |

**Wnioski:** Największe przekroczenia czasowe wynikały z:
- Integracja yfinance — obsługa weekendowych/nocnych braków danych wymagała dodatkowego fallbacku
- Design system retro — dopracowanie efektów CRT scanlines i animacji zajęło więcej niż planowano
- Graf D3.js — optymalizacja renderowania 503 węzłów na Canvas wymagała tuning fizyki sił

---

## 4. Decyzje Projektowe

### 4.1 Wybór technologii

| Obszar | Wybór | Alternatywy | Uzasadnienie |
|--------|-------|-------------|--------------|
| Backend framework | **FastAPI** | Flask, Django | Automatyczna dokumentacja Swagger, async, szybkość |
| Dane giełdowe | **yfinance** | Alpha Vantage, Finnhub | Bezpłatne, bez klucza API, bogate dane |
| Frontend framework | **React 19** | Vue 3, Svelte | Największy ekosystem, hooks, popularnośc |
| Bundler | **Vite 7** | Webpack, Turbopack | Błyskawiczny HMR, natywne ESM |
| Wizualizacja | **react-force-graph-2d** | D3.js pure, vis.js | Canvas/WebGL rendering, integracja z React |
| CSS framework | **Tailwind CSS 4** | Styled Components, CSS Modules | Szybkie prototypowanie, utility-first |
| Hosting | **Netlify** | Vercel, GitHub Pages | Proste, bezpłatne, auto-deploy z GitHub |

### 4.2 Kluczowe decyzje architektoniczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **SPA + REST API** (nie SSR) | Interaktywność grafu wymaga client-side rendering |
| **Cache JSON** (nie baza danych) | Dane read-only, 503 rekordów — baza byłaby overengineering |
| **Canvas** (nie SVG) | SVG nie udźwignie 503 węzłów + linii — Canvas/WebGL niezbędny |
| **Wbudowane dane offline** | Aplikacja musi działać bez backendu (Netlify = statyczny hosting) |
| **Multi-stage fetch** | 3-warstwowy fallback gwarantuje, że app zawsze działa |
| **React hooks** (nie Redux) | Stan prosty (1 lista + filtry) — Redux byłby niepotrzebną komplikacją |

---

## 5. Problemy Napotkane i Rozwiązania

### Problem 1: Yahoo Finance API niedostępne w weekend/noc
**Opis:** yfinance zwraca `JSONDecodeError` lub timeout poza godzinami giełdy  
**Przyczyna:** Yahoo Finance API ma ograniczoną dostępność w weekendy  
**Rozwiązanie:** Hardcoded `REAL_PRICES` dictionary z prawdziwymi cenami ~95 głównych spółek. Cache JSON jako dodatkowy backup.

### Problem 2: Renderowanie 503 węzłów + linii
**Opis:** SVG rendering powodował 5-10 FPS przy 503 węzłach  
**Rozwiązanie:** Użycie `react-force-graph-2d` z Canvas rendering. Węzły jako piksele (`fillRect`), warunkowe etykiety, ograniczona liczba linków (max 5 per sektor).

### Problem 3: Re-rendering grafu przy hover
**Opis:** Graf resetował pozycje węzłów przy każdym hover  
**Rozwiązanie:** Oddzielny state `hoveredStock` + `liveData` — nie mutujemy tablicy `stocks[]`. Graf nie re-renderuje się.

### Problem 4: Vercel deployment — account blocked
**Opis:** Vercel zablokował rejestrację konta (error: `user_blocked`)  
**Rozwiązanie:** Przejście na Netlify jako alternatywny hosting. Zachowano `vercel.json` dla przyszłego użytku.

### Problem 5: CORS i multi-environment fetch
**Opis:** Frontend musi działać na Vercel (relatywne URL), localhost (FastAPI), i offline  
**Rozwiązanie:** 3-warstwowy fetch: najpierw `/api/stocks` (relatywny), potem `localhost:8000`, potem fallback data.

---

## 6. Metryki Projektu

### Rozmiar kodu źródłowego (bez generowanego fallbackData.js)
| Plik | Linie kodu | Opis |
|------|-----------|------|
| `main.py` | 310 | Backend FastAPI |
| `App.jsx` | 497 | Główny komponent React |
| `index.css` | 406 | Style retro + responsive |
| `ConstellationGraph.jsx` | 307 | Wizualizacja D3.js |
| `RetroWindow.jsx` | 90 | Komponent okna |
| `api/stocks.py` | 127 | Serverless: lista akcji |
| `api/stock.py` | 90 | Serverless: pojedyncza akcja |
| `api/health.py` | 15 | Serverless: health check |
| `fallbackData.js` | 511 | Wbudowane dane (generowane) |
| **SUMA** | **2353** | — |

### Zależności
| Typ | Produkcyjne | Deweloperskie |
|-----|-------------|---------------|
| Backend (Python) | 4 | 0 |
| Frontend (npm) | 6 | 7 |

### Git
- **Liczba commitów:** 11
- **Branch:** `main`
- **Hosting:** Netlify (auto-deploy)

---

## 7. Wnioski i Rekomendacje

### Co poszło dobrze
1. FastAPI umożliwił szybki prototyp backendu z automatyczną dokumentacją Swagger
2. react-force-graph zapewnił wydajne renderowanie 503 węzłów na Canvas
3. Multi-stage fetch gwarantuje, że aplikacja zawsze działa (online lub offline)
4. Estetyka retro Windows 98 daje wyjątkowy, rozpoznawalny wygląd
5. Netlify pozwolił na szybki deployment bez konfiguracji serwera

### Co można poprawić
1. Dodać testy jednostkowe (pytest dla backendu, vitest dla frontendu)
2. Zaimplementować WebSocket dla real-time price streaming
3. Dodać CI/CD pipeline (GitHub Actions)
4. Rozważyć service worker (PWA) do pełnego offline mode z aktualizacjami
5. Dodać rate limiting na API (express-rate-limit lub FastAPI middleware)

### Rekomendacje na przyszłość
1. **Backup data source** — Alpha Vantage lub Finnhub jako fallback dla yfinance
2. **Monitoring** — Sentry dla frontend errors, healthcheck endpoint monitoring
3. **Progressive loading** — ładowanie danych w batches dla wolnych połączeń
4. **Internacjonalizacja** — wsparcie dla innych indeksów (DAX, FTSE, Nikkei)
5. **Portfolio tracker** — możliwość dodawania akcji do obserwowanych (localStorage)
