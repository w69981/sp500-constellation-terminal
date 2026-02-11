import { useEffect, useState, useCallback } from 'react';
import './index.css';
import RetroWindow from './components/RetroWindow';
import ConstellationGraph from './components/ConstellationGraph';
import FALLBACK_STOCKS from './data/fallbackData';

// API URL — uses env variable or defaults to localhost backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// S&P 500 GICS Sectors
const SECTORS = [
  'All',
  'Information Technology',
  'Communication Services',
  'Consumer Discretionary',
  'Consumer Staples',
  'Health Care',
  'Industrials',
  'Utilities',
  'Energy',
  'Financials',
  'Real Estate',
  'Materials'
];

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sectorFilter, setSectorFilter] = useState('All');
  const [hoveredStock, setHoveredStock] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch stock data from backend with fallback
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/stocks`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setStocks(data.stocks || []);
        setLastUpdated(data.last_updated);
        setIsOffline(false);
        setError(null);
      } catch (err) {
        console.warn('Backend unavailable, using fallback data:', err.message);
        setStocks(FALLBACK_STOCKS);
        setLastUpdated(new Date().toISOString());
        setIsOffline(true);
        setError(null); // Don't show error — graceful fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Fetch LIVE data for a single stock on hover
  const fetchLiveStockData = useCallback(async (ticker) => {
    if (isOffline) return null;
    try {
      setIsLoadingLive(true);
      const response = await fetch(`${API_URL}/api/stock/${ticker}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (data.success && data.stock) return data.stock;
    } catch (err) {
      console.error('Error fetching live data:', err);
    } finally {
      setIsLoadingLive(false);
    }
    return null;
  }, [isOffline]);

  // Calculate market stats
  const filteredStocks = sectorFilter === 'All' ? stocks : stocks.filter(s => s.sector === sectorFilter);
  const totalMarketCap = filteredStocks.reduce((sum, s) => sum + (s.market_cap || 0), 0);
  const gainers = filteredStocks.filter(s => s.change_percent > 0).length;
  const losers = filteredStocks.filter(s => s.change_percent < 0).length;

  // Format numbers
  const formatMC = (val) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val}`;
  };

  // Handle node hover — fetch live data
  const handleNodeHover = useCallback(async (node) => {
    if (node) {
      setHoveredStock(node);
      if (!isOffline) {
        const liveData = await fetchLiveStockData(node.ticker);
        if (liveData) {
          setHoveredStock(prev => prev?.ticker === node.ticker ? {
            ...prev,
            price: liveData.price,
            changePercent: liveData.change_percent,
            marketCap: liveData.market_cap,
            isLive: true
          } : prev);
        }
      }
    } else {
      setHoveredStock(null);
    }
  }, [isOffline, fetchLiveStockData]);

  // ──── Panel Components (reusable for both desktop & mobile) ────

  const MarketDataPanel = (
    <RetroWindow
      title="MARKET DATA"
      defaultPosition={{ x: 20, y: 50 }}
      width={isMobile ? '100%' : '260px'}
      disableDrag={isMobile}
    >
      <div className="retro-inset p-2 font-mono-retro text-green-400 text-xs">
        <div className="mb-2">
          <span className="text-gray-400">TOTAL MCAP:</span>
          <br />
          <span className="text-lg">{formatMC(totalMarketCap)}</span>
        </div>
        <div className="flex gap-4">
          <div>
            <span className="text-gray-400">GAINERS:</span>
            <br />
            <span className="text-green-500 text-lg">{gainers}</span>
          </div>
          <div>
            <span className="text-gray-400">LOSERS:</span>
            <br />
            <span className="text-red-500 text-lg">{losers}</span>
          </div>
        </div>
        <div className="mt-2 text-gray-500 text-[10px]">
          STOCKS: {filteredStocks.length} / {stocks.length}
        </div>
      </div>
    </RetroWindow>
  );

  const SectorFilterPanel = (
    <RetroWindow
      title="SECTOR FILTER"
      defaultPosition={{ x: 20, y: 200 }}
      width={isMobile ? '100%' : '260px'}
      disableDrag={isMobile}
    >
      <div className="retro-inset p-2 font-mono-retro text-xs max-h-48 overflow-y-auto">
        {SECTORS.map(sector => (
          <button
            key={sector}
            onClick={() => {
              setSectorFilter(sector);
              if (isMobile) setShowPanels(false);
            }}
            className={`w-full text-left px-2 py-1 mb-1 ${sectorFilter === sector
              ? 'bg-blue-800 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            style={{
              border: '2px solid',
              borderTopColor: sectorFilter === sector ? '#000' : '#808080',
              borderLeftColor: sectorFilter === sector ? '#000' : '#808080',
              borderBottomColor: sectorFilter === sector ? '#fff' : '#000',
              borderRightColor: sectorFilter === sector ? '#fff' : '#000',
            }}
          >
            {sector === 'All' ? '[ ALL SECTORS ]' : sector.toUpperCase()}
          </button>
        ))}
      </div>
    </RetroWindow>
  );

  const TopGainersPanel = (
    <RetroWindow
      title="TOP GAINERS"
      defaultPosition={{ x: 20, y: 470 }}
      width={isMobile ? '100%' : '260px'}
      disableDrag={isMobile}
    >
      <div className="retro-inset p-2 font-mono-retro text-xs max-h-40 overflow-y-scroll" onMouseLeave={() => setHoveredStock(null)}>
        {filteredStocks
          .filter(s => s.change_percent > 0)
          .sort((a, b) => b.change_percent - a.change_percent)
          .slice(0, 15)
          .map(stock => (
            <div
              key={stock.ticker}
              className="flex justify-between py-1 border-b border-gray-700 cursor-pointer hover:bg-green-900"
              onMouseEnter={() => setHoveredStock({
                ticker: stock.ticker, name: stock.name, sector: stock.sector,
                marketCap: stock.market_cap, price: stock.price,
                changePercent: stock.change_percent, weight: stock.weight
              })}
            >
              <span className="text-green-400">{stock.ticker}</span>
              <span className="text-green-500">+{stock.change_percent.toFixed(2)}%</span>
            </div>
          ))}
      </div>
    </RetroWindow>
  );

  const StockDetailPanel = (
    <RetroWindow
      title="STOCK DETAIL"
      defaultPosition={{ x: Math.max(window.innerWidth - 320, 300), y: 50 }}
      width={isMobile ? '100%' : '300px'}
      disableDrag={isMobile}
    >
      <div className="retro-inset p-3 font-mono-retro text-xs min-h-[200px]">
        {hoveredStock ? (
          <div className="text-green-400">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-white">{hoveredStock.ticker}</div>
              <div className="text-sm text-gray-400">{hoveredStock.name}</div>
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">SECTOR:</span>
                <span className="text-cyan-400">{hoveredStock.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PRICE:</span>
                <span className="text-white text-lg">${hoveredStock.price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CHANGE:</span>
                <span className={`text-lg ${hoveredStock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {hoveredStock.changePercent >= 0 ? '+' : ''}{hoveredStock.changePercent?.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MARKET CAP:</span>
                <span className="text-yellow-400">{formatMC(hoveredStock.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">WEIGHT:</span>
                <span className="text-white">{hoveredStock.weight?.toFixed(4)}%</span>
              </div>
            </div>
            <hr className="border-gray-600 my-2" />
            <div className="text-center text-[10px]">
              {isOffline ? (
                <span className="text-yellow-400">⚠ OFFLINE MODE</span>
              ) : isLoadingLive ? (
                <span className="text-yellow-400">⟳ LOADING LIVE DATA...</span>
              ) : hoveredStock.isLive ? (
                <span className="text-green-400">● LIVE DATA</span>
              ) : (
                <span className="text-gray-500">HOVER TO LOAD LIVE DATA</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">?</div>
              <div>HOVER OVER A STOCK</div>
              <div>TO VIEW DETAILS</div>
            </div>
          </div>
        )}
      </div>
    </RetroWindow>
  );

  const LegendPanel = (
    <RetroWindow
      title="LEGEND"
      defaultPosition={{ x: Math.max(window.innerWidth - 320, 300), y: 320 }}
      width={isMobile ? '100%' : '300px'}
      disableDrag={isMobile}
    >
      <div className="space-y-2 p-1">
        <div className="retro-inset p-2 text-xs font-mono-retro">
          <div className="text-gray-400 mb-1">NODE COLORS:</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3" style={{ backgroundColor: '#00FF00' }}></div>
            <span>PRICE UP (GREEN)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3" style={{ backgroundColor: '#FF0000' }}></div>
            <span>PRICE DOWN (RED)</span>
          </div>
        </div>
        <div className="retro-inset p-2 text-xs font-mono-retro">
          <div className="text-gray-400 mb-1">CONSTELLATION LINES:</div>
          <div className="text-[10px] text-gray-300">
            Lines connect stocks in the same sector forming constellation patterns
          </div>
        </div>
        <div className="text-[10px] font-mono-retro text-gray-500 p-1">
          SIZE = MARKET CAP<br />
          DRAG NODES TO MOVE<br />
          SCROLL TO ZOOM
        </div>
      </div>
    </RetroWindow>
  );

  const TopLosersPanel = (
    <RetroWindow
      title="TOP LOSERS"
      defaultPosition={{ x: Math.max(window.innerWidth - 320, 300), y: 530 }}
      width={isMobile ? '100%' : '300px'}
      disableDrag={isMobile}
    >
      <div className="retro-inset p-2 font-mono-retro text-xs max-h-40 overflow-y-scroll" onMouseLeave={() => setHoveredStock(null)}>
        {filteredStocks
          .filter(s => s.change_percent < 0)
          .sort((a, b) => a.change_percent - b.change_percent)
          .slice(0, 15)
          .map(stock => (
            <div
              key={stock.ticker}
              className="flex justify-between py-1 border-b border-gray-700 cursor-pointer hover:bg-red-900"
              onMouseEnter={() => setHoveredStock({
                ticker: stock.ticker, name: stock.name, sector: stock.sector,
                marketCap: stock.market_cap, price: stock.price,
                changePercent: stock.change_percent, weight: stock.weight
              })}
            >
              <span className="text-red-400">{stock.ticker}</span>
              <span className="text-red-500">{stock.change_percent.toFixed(2)}%</span>
            </div>
          ))}
      </div>
    </RetroWindow>
  );

  return (
    <div className="w-screen h-screen overflow-hidden scanlines" style={{ backgroundColor: '#000080' }}>
      {/* ──── Main Constellation Area ──── */}
      <div className="absolute inset-0 z-0">
        {loading && stocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="retro-window p-4">
              <div className="font-mono-retro text-black loading-pulse">
                LOADING S&P 500 DATA<span className="loading-dots"></span>
              </div>
            </div>
          </div>
        ) : error && stocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="retro-window p-4">
              <div className="font-mono-retro text-red-600">
                ERROR: {error}
              </div>
            </div>
          </div>
        ) : (
          <ConstellationGraph
            stocks={stocks}
            sectorFilter={sectorFilter}
            onNodeHover={handleNodeHover}
          />
        )}
      </div>

      {/* ──── Header Title Bar ──── */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="retro-titlebar py-1 px-2">
          <span className="font-serif-retro text-[11px] sm:text-sm tracking-wide header-title">
            S&P 500 CONSTELLATION TERMINAL
          </span>
          <span className="font-mono-retro text-xs">
            {new Date().toLocaleString('en-US', {
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            })}
          </span>
        </div>
        {/* Offline Banner */}
        {isOffline && (
          <div className="offline-banner">
            ⚠ OFFLINE MODE — SHOWING CACHED DATA ({stocks.length} STOCKS)
          </div>
        )}
      </div>

      {/* ──── Desktop Panels ──── */}
      {!isMobile && (
        <div className="panels-container">
          {MarketDataPanel}
          {SectorFilterPanel}
          {TopGainersPanel}
          {StockDetailPanel}
          {LegendPanel}
          {TopLosersPanel}
        </div>
      )}

      {/* ──── Mobile: Toggle Button + Drawer ──── */}
      {isMobile && (
        <>
          <button
            className="mobile-menu-btn"
            onClick={() => setShowPanels(!showPanels)}
          >
            {showPanels ? '✕ CLOSE' : '☰ PANELS'}
          </button>

          {showPanels && (
            <>
              <div className="panels-overlay" onClick={() => setShowPanels(false)} />
              <div className="panels-drawer">
                {MarketDataPanel}
                {SectorFilterPanel}
                {StockDetailPanel}
                {TopGainersPanel}
                {TopLosersPanel}
                {LegendPanel}
              </div>
            </>
          )}
        </>
      )}

      {/* ──── Status Bar ──── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 retro-statusbar flex gap-2 sm:gap-4">
        <div className="retro-statusbar-cell flex-1">
          <span className="font-mono-retro">
            {loading ? 'FETCHING...' : isOffline ? '⚠ OFFLINE' : 'READY'}
          </span>
        </div>
        <div className="retro-statusbar-cell">
          <span className="font-mono-retro">
            FILTER: {sectorFilter === 'All' ? 'ALL' : sectorFilter.toUpperCase().slice(0, 12)}
          </span>
        </div>
        {!isMobile && (
          <div className="retro-statusbar-cell">
            <span className="font-mono-retro">
              {isLoadingLive ? '⟳ LOADING' : 'READY'}
            </span>
          </div>
        )}
        <div className="retro-statusbar-cell">
          <span className="font-mono-retro">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
