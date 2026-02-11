# Podręcznik Użytkownika

## S&P 500 Constellation Terminal

---

## 1. Wprowadzenie

S&P 500 Constellation Terminal to interaktywna wizualizacja wszystkich spółek wchodzących w skład indeksu S&P 500. Aplikacja prezentuje dane w formie grafu konstelacji, umożliwiając intuicyjne przeglądanie i analizę rynku akcji.

---

## 2. Główne Elementy Interfejsu

### 2.1 Pasek Tytułowy
Na górze ekranu znajduje się pasek z nazwą aplikacji i aktualnym czasem.

### 2.2 Graf Konstelacji (centrum)
Główna wizualizacja przedstawiająca wszystkie akcje jako węzły:
- **Kolor zielony** - akcje na plusie
- **Kolor czerwony** - akcje na minusie  
- **Rozmiar węzła** - proporcjonalny do kapitalizacji rynkowej
- **Linie** - łączą akcje z tego samego sektora

### 2.3 Panele Boczne

| Panel | Lokalizacja | Funkcja |
|-------|-------------|---------|
| MARKET DATA | Lewy górny | Statystyki rynkowe |
| SECTOR FILTER | Lewy środkowy | Filtrowanie sektorów |
| TOP GAINERS | Lewy dolny | Lista najlepszych akcji |
| STOCK DETAIL | Prawy górny | Szczegóły wybranej akcji |
| LEGEND | Prawy środkowy | Legenda oznaczeń |
| TOP LOSERS | Prawy dolny | Lista najgorszych akcji |

### 2.4 Pasek Statusu
Na dole ekranu - status aplikacji, aktywny filtr, ostatnia aktualizacja.

---

## 3. User Stories - Przykłady Użycia

### US-01: Przeglądanie całego rynku

> **Jako** inwestor  
> **Chcę** zobaczyć wszystkie spółki S&P 500 na jednym ekranie  
> **Aby** mieć szybki przegląd kondycji rynku

**Kroki:**
1. Otwórz aplikację (http://localhost:5173)
2. Poczekaj na załadowanie danych
3. Obserwuj graf konstelacji - zielone węzły = wzrosty, czerwone = spadki

---

### US-02: Filtrowanie po sektorze

> **Jako** analityk  
> **Chcę** zobaczyć tylko spółki z sektora technologicznego  
> **Aby** skupić się na konkretnej branży

**Kroki:**
1. W panelu SECTOR FILTER znajdź "INFORMATION TECHNOLOGY"
2. Kliknij na wybrany sektor
3. Graf zaktualizuje się pokazując tylko spółki z tego sektora
4. Panel MARKET DATA pokaże statystyki dla wybranego sektora

---

### US-03: Sprawdzanie szczegółów akcji

> **Jako** inwestor  
> **Chcę** poznać szczegóły konkretnej spółki  
> **Aby** podjąć decyzję inwestycyjną

**Kroki:**
1. Najedź kursorem na węzeł akcji w grafie (np. AAPL)
2. Panel STOCK DETAIL wyświetli:
   - Ticker i nazwę spółki
   - Sektor
   - Aktualną cenę
   - Zmianę procentową
   - Kapitalizację rynkową
   - Wagę w indeksie
3. Wskaźnik "LIVE DATA" potwierdzi aktualne dane

---

### US-04: Identyfikacja najlepszych i najgorszych

> **Jako** trader  
> **Chcę** szybko znaleźć największe wzrosty i spadki  
> **Aby** zidentyfikować okazje tradingowe

**Kroki:**
1. Spójrz na panel TOP GAINERS (lewa strona) - lista akcji z największymi wzrostami
2. Spójrz na panel TOP LOSERS (prawa strona) - lista akcji z największymi spadkami
3. Najedź na dowolną pozycję aby zobaczyć szczegóły

---

### US-05: Nawigacja po grafie

> **Jako** użytkownik  
> **Chcę** przybliżyć i przesunąć widok  
> **Aby** lepiej zobaczyć interesujące mnie akcje

**Kroki:**
1. **Zoom** - użyj scrolla myszy aby przybliżyć/oddalić
2. **Przesuwanie** - przeciągnij tło grafu
3. **Przeciąganie węzłów** - złap i przesuń pojedynczy węzeł akcji

---

### US-06: Powrót do widoku wszystkich sektorów

> **Jako** użytkownik  
> **Chcę** wrócić do widoku całego rynku  
> **Aby** zobaczyć pełny obraz po filtrowaniu

**Kroki:**
1. W panelu SECTOR FILTER kliknij "[ ALL SECTORS ]"
2. Graf pokaże wszystkie 500+ spółek
3. Statystyki w MARKET DATA zaktualizują się

---

## 4. Interpretacja Danych

### Kolory węzłów
- 🟢 **Zielony** - cena akcji wzrosła (change_percent > 0)
- 🔴 **Czerwony** - cena akcji spadła (change_percent < 0)
- Intensywność koloru odpowiada wielkości zmiany

### Rozmiar węzłów
- Większy węzeł = większa kapitalizacja rynkowa
- AAPL, MSFT, NVDA mają największe węzły (~$2-3T)
- Mniejsze spółki mają odpowiednio mniejsze węzły

### Linie konstelacji
- Łączą spółki z tego samego sektora
- Tworzą wizualne grupowanie branżowe
- Ułatwiają identyfikację klastrów sektorowych

---

## 5. Wskazówki

1. **Najlepszy widok** - użyj pełnego ekranu (F11)
2. **Aktualizacja danych** - dane są pobierane przy starcie serwera
3. **Hover na listach** - najeżdżanie na TOP GAINERS/LOSERS też pokazuje szczegóły
4. **Przeciąganie okien** - panele boczne można przeciągać za pasek tytułowy

---

## 6. Rozwiązywanie Problemów

| Problem | Rozwiązanie |
|---------|-------------|
| Puste okno | Sprawdź czy backend działa (port 8000) |
| "LOADING..." | Poczekaj na pobranie danych |
| Błąd połączenia | Upewnij się że oba serwery są uruchomione |
| Stare ceny | Zrestartuj serwer backend |
