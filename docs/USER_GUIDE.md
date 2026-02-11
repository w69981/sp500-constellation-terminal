# Podręcznik Użytkownika

## S&P 500 Constellation Terminal

---

## 1. Wprowadzenie

S&P 500 Constellation Terminal to interaktywna wizualizacja wszystkich 503 spółek wchodzących w skład indeksu S&P 500. Aplikacja prezentuje dane giełdowe w formie grafu konstelacji z estetyką retro inspirowaną Windows 98.

**Live demo:** [melodious-phoenix-660ab6.netlify.app](https://melodious-phoenix-660ab6.netlify.app)

### Tryby pracy
| Tryb | Opis | Dane |
|------|------|------|
| **Online (z backendem)** | Frontend + FastAPI backend | Live ceny z Yahoo Finance |
| **Offline (bez backendu)** | Tylko frontend | 503 spółek z wbudowanymi danymi |

---

## 2. Główne Elementy Interfejsu

### 2.1 Pasek Tytułowy
Na górze ekranu — nazwa aplikacji **"S&P 500 CONSTELLATION TERMINAL"** i zegar czasu rzeczywistego (prawy róg).

### 2.2 Banner statusu
Bezpośrednio pod paskiem tytułowym. Wyświetla się w trybie offline:
```
⚠ OFFLINE MODE — SHOWING CACHED DATA (503 STOCKS)
```
W trybie online (z backendem) banner się nie pojawia.

### 2.3 Graf Konstelacji (centrum ekranu)
Główna wizualizacja — wszystkie 503 akcje jako interaktywne węzły:
- **Kolor zielony** 🟢 — akcje na plusie (pozytywna zmiana %)
- **Kolor czerwony** 🔴 — akcje na minusie (negatywna zmiana %)
- **Rozmiar węzła** — proporcjonalny do kapitalizacji rynkowej (AAPL, MSFT, NVDA mają największe węzły)
- **Linie konstelacji** — łączą spółki z tego samego sektora GICS
- **Etykiety** — tickery widoczne na większych węzłach przy odpowiednim zoomie

### 2.4 Panele Informacyjne

| Panel | Lokalizacja | Funkcja |
|-------|-------------|---------|
| **MARKET DATA** | Lewy górny | Total market cap, liczba gainers/losers, liczba załadowanych akcji |
| **SECTOR FILTER** | Lewy środkowy | Lista 11 sektorów GICS — kliknij aby filtrować |
| **TOP GAINERS** | Lewy dolny | 9 akcji z największymi wzrostami (zielone) |
| **STOCK DETAIL** | Prawy górny | Szczegóły wybranej akcji (hover) z live danymi |
| **LEGEND** | Prawy środkowy | Legenda kolorów, rozmiarów i oznaczeń |
| **TOP LOSERS** | Prawy dolny | 9 akcji z największymi spadkami (czerwone) |

### 2.5 Pasek Statusu (dolna krawędź)
- **Lewa strona:** Status połączenia (`READY` lub `⚠ OFFLINE`)
- **Prawa strona:** Aktywny filtr (`FILTER: ALL` lub nazwa sektora), status, zegar

### 2.6 Widok mobilny (< 768px)
Na urządzeniach mobilnych panele boczne są ukryte. Przycisk **☰** w prawym górnym rogu otwiera szufladę (drawer) z panelami.

---

## 3. Przykłady Użycia Głównych Funkcjonalności

### Przykład 1: Przeglądanie całego rynku S&P 500

> **Jako** inwestor  
> **Chcę** zobaczyć wszystkie 503 spółki S&P 500 na jednym ekranie  
> **Aby** mieć szybki przegląd kondycji rynku

**Kroki:**
1. Otwórz aplikację — [melodious-phoenix-660ab6.netlify.app](https://melodious-phoenix-660ab6.netlify.app) lub `http://localhost:5173`
2. Poczekaj na załadowanie danych (~1-2 sekundy)
3. Obserwuj graf konstelacji:
   - Przewaga **zielonych** węzłów → rynek rośnie
   - Przewaga **czerwonych** węzłów → rynek spada
4. Panel **MARKET DATA** pokaże:
   - **Total MCAP** — łączna kapitalizacja rynkowa (~$62T)
   - **Gainers / Losers** — ile akcji rośnie vs spada
   - **Stocks** — 503 / 503 załadowane

---

### Przykład 2: Filtrowanie akcji po sektorze

> **Jako** analityk sektorowy  
> **Chcę** zobaczyć tylko spółki technologiczne  
> **Aby** skupić się na konkretnej branży

**Kroki:**
1. W panelu **SECTOR FILTER** znajdź **"INFORMATION TECHNOLOGY"**
2. Kliknij na wybrany sektor
3. Graf zaktualizuje się — **zostaną tylko akcje z wybranego sektora**
4. Panel **MARKET DATA** pokaże statystyki filtrowanego sektora
5. Pasek statusu pokaże: `FILTER: INFORMATION TECHNOLOGY`
6. **TOP GAINERS** i **TOP LOSERS** zaktualizują się do wybranego sektora

**Dostępne sektory GICS (11):**
Information Technology, Communication Services, Consumer Discretionary, Consumer Staples, Health Care, Industrials, Utilities, Energy, Financials, Materials, Real Estate

**Powrót do widoku wszystkich:** Kliknij **"[ ALL SECTORS ]"** na górze listy.

---

### Przykład 3: Sprawdzanie szczegółów akcji (hover)

> **Jako** inwestor  
> **Chcę** poznać szczegóły konkretnej spółki  
> **Aby** podjąć decyzję inwestycyjną

**Kroki:**
1. Najedź kursorem na węzeł akcji w grafie (np. duży węzeł AAPL)
2. Panel **STOCK DETAIL** w prawym górnym rogu wyświetli:
   - **Ticker** i pełna nazwa spółki (np. `AAPL — Apple Inc.`)
   - **Sektor** (np. Information Technology)
   - **Cena** (np. $273.68)
   - **Zmiana %** (np. +0.07% — zielona lub czerwona)
   - **Kapitalizacja rynkowa** (np. $4.02T)
   - **Waga w indeksie** (np. 6.42%)
3. Wskaźnik **● LIVE DATA** potwierdzi dane aktualne z Yahoo Finance
   - Jeśli backend jest niedostępny, wyświetli dane z cache

---

### Przykład 4: Identyfikacja najlepszych i najgorszych akcji

> **Jako** trader  
> **Chcę** szybko znaleźć największe wzrosty i spadki  
> **Aby** zidentyfikować okazje tradingowe

**Kroki:**
1. Spójrz na panel **TOP GAINERS** (lewa dolna strona):
   - Lista 9 akcji z **największymi dziennymi wzrostami** (%)
   - Kolorem zielonym z wartością procentową (np. `ULTA +2.00%`)
2. Spójrz na panel **TOP LOSERS** (prawa dolna strona):
   - Lista 9 akcji z **największymi dziennymi spadkami** (%)
   - Kolorem czerwonym z wartością procentową (np. `CFG -2.00%`)
3. Najedź na dowolną pozycję na liście — panel STOCK DETAIL pokaże szczegóły

---

### Przykład 5: Nawigacja po grafie (zoom i przeciąganie)

> **Jako** użytkownik  
> **Chcę** przybliżyć i przesunąć widok  
> **Aby** lepiej zobaczyć interesujące mnie akcje

**Kroki:**
1. **Zoom in/out** — użyj **scrolla myszy** aby przybliżyć/oddalić graf
2. **Przesuwanie** — kliknij i **przeciągnij tło** grafu aby zmienić widok
3. **Przeciąganie węzłów** — kliknij i **przeciągnij pojedynczy węzeł** akcji do dowolnej pozycji
4. Etykiety tickerów pojawiają się automatycznie przy dużym zoomie na większych węzłach

---

### Przykład 6: Używanie aplikacji na telefonie

> **Jako** użytkownik mobilny  
> **Chcę** przeglądać dane na smartfonie  
> **Aby** sprawdzić rynek w podróży

**Kroki:**
1. Otwórz aplikację w przeglądarce mobilnej
2. Graf konstelacji zajmuje pełny ekran
3. Kliknij przycisk **☰** (hamburger menu) w prawym górnym rogu
4. Otworzy się **szuflada** z panelami (MARKET DATA, SECTOR FILTER, etc.)
5. Przeglądaj panele przewijając szufladę w dół
6. Kliknij ponownie **☰** lub poza szufladę aby ją zamknąć
7. Nawigacja po grafie: **dotknij i przeciągnij** (pan), **pinch** (zoom)

---

## 4. Interpretacja Danych Wizualnych

### Kolory węzłów
| Kolor | Znaczenie |
|-------|-----------|
| 🟢 Zielony | Cena akcji wzrosła (change_percent > 0) |
| 🔴 Czerwony | Cena akcji spadła (change_percent < 0) |

Intensywność koloru odpowiada wielkości zmiany procentowej.

### Rozmiar węzłów
Rozmiar jest proporcjonalny do **kapitalizacji rynkowej** spółki:

| Rozmiar | Przykłady | Kapitalizacja |
|---------|-----------|---------------|
| Bardzo duży | AAPL, MSFT, NVDA | > $2T |
| Duży | AMZN, GOOGL, META | $0.5T - $2T |
| Średni | JPM, V, WMT | $100B - $500B |
| Mały | Większość spółek | < $100B |

### Linie konstelacji
- Łączą spółki **z tego samego sektora GICS**
- Tworzą wizualne grupowanie branżowe
- Ułatwiają identyfikację klastrów sektorowych
- Max 5 połączeń per sektor (optymalizacja wydajności)

### Wskaźnik LIVE DATA
- **● LIVE DATA** (zielony) — dane pobrane w real-time z Yahoo Finance
- Pojawia się w panelu STOCK DETAIL przy hover (wymaga backendu)

---

## 5. Wskazówki Praktyczne

1. **Najlepszy widok** — użyj pełnego ekranu (F11) na monitorze ≥ 1080p
2. **Dane live** — uruchom backend (`python3 -m uvicorn main:app --reload`) aby mieć aktualne ceny
3. **Szybkie filtrowanie** — kliknij sektor w SECTOR FILTER zamiast szukać na grafie
4. **Hover na listach** — najeżdżanie na pozycje w TOP GAINERS/LOSERS też wyświetla szczegóły
5. **Przeciąganie okien** — panele boczne można przeciągać za pasek tytułowy (tylko desktop)

---

## 6. Rozwiązywanie Problemów

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| "OFFLINE MODE" banner | Backend nie działa | Uruchom `python3 -m uvicorn main:app --reload --port 8000` |
| "LOADING..." nie znika | Wolne połączenie / timeout | Poczekaj 5s — app przejdzie do trybu offline |
| Brak danych live przy hover | Backend niedostępny | Sprawdź czy backend działa na porcie 8000 |
| Stare ceny | Cache z wczoraj | Zrestartuj backend lub użyj `POST /api/refresh` |
| Graf się nie ruszą | Przeglądarka blokuje WebGL | Użyj Chrome/Firefox, włącz hardware acceleration |
| Małe węzły bez etykiet | Za mały zoom | Przybliż graf scrollem myszy |
| Panele nie widać (mobile) | Szuflada zamknięta | Kliknij ☰ (hamburger) w prawym górnym rogu |
