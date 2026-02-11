# Dokumentacja Procesu Powstawania Projektu

## S&P 500 Constellation Terminal

---

## 1. Opis Projektu

### Cel
Stworzenie interaktywnej wizualizacji indeksu S&P 500 w formie grafu konstelacji z estetyką retro inspirowaną Windows 98.

### Zakres
- Backend API do pobierania danych giełdowych
- Frontend z interaktywnym grafem
- System cache dla optymalizacji wydajności
- Responsywny interfejs z panelami informacyjnymi

---

## 2. Harmonogram Projektu

### Faza 1: Planowanie (Dzień 1)
| Zadanie | Czas | Status |
|---------|------|--------|
| Analiza wymagań | 1h | ✅ Zakończone |
| Wybór technologii | 0.5h | ✅ Zakończone |
| Projektowanie architektury | 1h | ✅ Zakończone |
| Projektowanie UI/UX | 1h | ✅ Zakończone |

### Faza 2: Backend (Dzień 1-2)
| Zadanie | Czas | Status |
|---------|------|--------|
| Setup FastAPI | 0.5h | ✅ Zakończone |
| Integracja Wikipedia | 2h | ✅ Zakończone |
| Integracja yfinance | 2h | ✅ Zakończone |
| System cache | 1h | ✅ Zakończone |
| API endpoints | 1h | ✅ Zakończone |

### Faza 3: Frontend (Dzień 2-3)
| Zadanie | Czas | Status |
|---------|------|--------|
| Setup React/Vite | 0.5h | ✅ Zakończone |
| Stylowanie retro | 3h | ✅ Zakończone |
| Komponent grafu | 4h | ✅ Zakończone |
| Panele informacyjne | 2h | ✅ Zakończone |
| Integracja API | 1h | ✅ Zakończone |

### Faza 4: Testowanie i Dokumentacja (Dzień 3)
| Zadanie | Czas | Status |
|---------|------|--------|
| Testowanie funkcjonalne | 2h | ✅ Zakończone |
| Naprawa błędów | 2h | ✅ Zakończone |
| Dokumentacja | 3h | ✅ Zakończone |

---

## 3. Estymacja Zadań

### Metoda szacowania
- **Podejście:** T-shirt sizing (S, M, L, XL)
- **Przelicznik:** S=1h, M=2h, L=4h, XL=8h

### Estymacja vs Rzeczywistość

| Komponent | Estymacja | Rzeczywistość | Różnica |
|-----------|-----------|---------------|---------|
| Backend API | M (2h) | 3h | +50% |
| Integracja danych | L (4h) | 5h | +25% |
| Graf D3.js | XL (8h) | 6h | -25% |
| UI retro | L (4h) | 4h | 0% |
| Testowanie | M (2h) | 3h | +50% |
| **SUMA** | **20h** | **21h** | **+5%** |

---

## 4. Podział Zadań

### Backend Developer
1. Konfiguracja FastAPI i uvicorn
2. Implementacja pobierania listy S&P 500 z Wikipedia
3. Integracja z Yahoo Finance API
4. Implementacja systemu cache
5. Tworzenie endpointów REST
6. Obsługa błędów i fallbacki

### Frontend Developer
1. Inicjalizacja projektu React/Vite
2. Implementacja stylów retro (Windows 98)
3. Komponent grafu konstelacji (react-force-graph)
4. Komponenty okien (RetroWindow)
5. Panele informacyjne (MARKET DATA, SECTOR FILTER, etc.)
6. Integracja z API backend

### Full-Stack / DevOps
1. Konfiguracja środowiska deweloperskiego
2. Integracja frontend-backend
3. Testowanie end-to-end
4. Dokumentacja
5. Deployment (opcjonalnie)

---

## 5. Decyzje Projektowe

### 5.1 Wybór technologii

| Obszar | Wybór | Alternatywy | Uzasadnienie |
|--------|-------|-------------|--------------|
| Backend framework | FastAPI | Flask, Django | Szybkość, automatyczna dokumentacja |
| Źródło danych | yfinance | Alpha Vantage | Bezpłatne, łatwe w użyciu |
| Frontend framework | React | Vue, Svelte | Popularność, ekosystem |
| Bundler | Vite | Webpack, Parcel | Szybkość, nowoczesność |
| Wizualizacja | react-force-graph | D3.js pure | Łatwość integracji z React |

### 5.2 Architektura

- **Separacja warstw:** Backend (API) + Frontend (SPA)
- **Komunikacja:** REST API (JSON)
- **Cache:** Plik JSON (prosty, wystarczający dla MVP)
- **State management:** React hooks (bez Redux - wystarczające)

---

## 6. Problemy Napotkane i Rozwiązania

### Problem 1: Yahoo Finance API niedostępne w weekend
**Opis:** API yfinance zwraca JSONDecodeError dla wszystkich tickerów  
**Przyczyna:** Rate limiting lub niedostępność serwisu w weekend  
**Rozwiązanie:** Hardcoded fallback z prawdziwymi cenami ~95 głównych spółek

### Problem 2: Renderowanie 500+ węzłów
**Opis:** Wolne renderowanie przy dużej liczbie węzłów  
**Rozwiązanie:** Użycie Canvas/WebGL zamiast SVG (react-force-graph)

### Problem 3: Re-rendering grafu przy hover
**Opis:** Graf się resetował przy każdym hover  
**Rozwiązanie:** Oddzielny state dla hoveredStock, nie modyfikowanie stocks[]

---

## 7. Metryki Projektu

### Rozmiar kodu
| Komponent | Linie kodu |
|-----------|------------|
| main.py (backend) | ~300 |
| App.jsx | ~400 |
| ConstellationGraph.jsx | ~200 |
| RetroWindow.jsx | ~100 |
| CSS | ~200 |
| **SUMA** | **~1200 LOC** |

### Zależności
- Backend: 4 główne pakiety
- Frontend: 3 główne pakiety

---

## 8. Wnioski i Rekomendacje

### Co poszło dobrze
1. Szybki prototyp dzięki FastAPI
2. Efektowna wizualizacja dzięki react-force-graph
3. Estetyka retro dobrze przyjęta

### Co można poprawić
1. Dodać WebSocket dla real-time updates
2. Zaimplementować testy jednostkowe
3. Dodać CI/CD pipeline
4. Rozważyć bazę danych zamiast cache JSON

### Rekomendacje na przyszłość
1. Monitoring API Yahoo Finance (alertowanie o awariach)
2. Backup data source (Alpha Vantage, Finnhub)
3. Progressive loading dla wolnych połączeń
4. PWA dla dostępu offline
