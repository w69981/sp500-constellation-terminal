"""
Vercel Serverless Function — GET /api/stock/[ticker]
Returns live data for a single stock using yfinance
"""
from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Real stock prices fallback
REAL_PRICES = {
    "AAPL": 227.63, "MSFT": 409.04, "NVDA": 129.84, "GOOGL": 185.34, "GOOG": 186.82,
    "AMZN": 235.42, "META": 719.76, "TSLA": 361.62, "BRK-B": 482.79, "AVGO": 238.59,
    "JPM": 276.00, "LLY": 821.79, "V": 344.26, "UNH": 517.08, "XOM": 105.10,
    "MA": 553.08, "COST": 1026.61, "HD": 406.66, "PG": 169.30, "JNJ": 150.73,
    "WMT": 102.38, "NFLX": 982.54, "CRM": 330.92, "BAC": 46.67, "ORCL": 174.59,
    "CVX": 147.68, "KO": 62.70, "MRK": 89.91, "ABBV": 181.35, "PEP": 142.41,
    "AMD": 112.58, "TMO": 538.84, "CSCO": 64.49, "ACN": 360.59, "LIN": 452.88,
    "MCD": 294.50, "ABT": 124.55, "ADBE": 430.58, "DHR": 233.43, "WFC": 79.68,
    "TXN": 192.47, "PM": 132.99, "VZ": 39.27, "NEE": 69.56, "INTC": 19.64,
    "QCOM": 168.92, "IBM": 248.55, "GE": 199.87, "CAT": 365.92, "NOW": 1024.35,
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract ticker from URL path: /api/stock?ticker=AAPL
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        ticker = params.get('ticker', [''])[0].upper()

        if not ticker:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": "Missing ticker"}).encode())
            return

        result = None

        # Try yfinance for live data
        try:
            import yfinance as yf
            stock = yf.Ticker(ticker)
            fi = stock.fast_info
            price = getattr(fi, 'last_price', 0) or 0
            prev = getattr(fi, 'previous_close', price) or price
            change = ((price - prev) / prev * 100) if prev else 0
            mc = getattr(fi, 'market_cap', 0) or 0

            if price > 0:
                result = {
                    "success": True,
                    "stock": {
                        "ticker": ticker, "price": round(price, 2),
                        "change_percent": round(change, 2),
                        "market_cap": mc, "is_live": True
                    },
                    "source": "live"
                }
        except Exception:
            pass

        # Fallback to hardcoded prices
        if not result and ticker in REAL_PRICES:
            result = {
                "success": True,
                "stock": {
                    "ticker": ticker, "price": REAL_PRICES[ticker],
                    "change_percent": 0, "market_cap": 0, "is_live": False
                },
                "source": "fallback"
            }

        if not result:
            result = {"success": False, "error": f"Ticker {ticker} not found"}

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
