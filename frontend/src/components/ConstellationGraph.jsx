import { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide, forceX, forceY } from 'd3-force';

/**
 * ConstellationGraph - Force-directed graph visualization of S&P 500 stocks
 * Optimized for 500+ nodes with Canvas rendering, tuned physics, and reduced links
 */
export default function ConstellationGraph({ stocks = [], sectorFilter = 'All', onNodeHover }) {
    const graphRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Transform stock data to graph format
    useEffect(() => {
        if (!stocks || stocks.length === 0) {
            setGraphData({ nodes: [], links: [] });
            return;
        }

        // Filter stocks by sector if filter is active
        const filteredStocks = sectorFilter === 'All'
            ? stocks
            : stocks.filter(s => s.sector === sectorFilter);

        if (filteredStocks.length === 0) {
            setGraphData({ nodes: [], links: [] });
            return;
        }

        // Find min/max market cap for scaling
        const marketCaps = filteredStocks.map(s => s.market_cap).filter(mc => mc > 0);
        if (marketCaps.length === 0) {
            setGraphData({ nodes: [], links: [] });
            return;
        }

        const minCap = Math.min(...marketCaps);
        const maxCap = Math.max(...marketCaps);

        // Determine if we're showing full index or filtered
        const isFullIndex = filteredStocks.length > 100;

        const nodes = filteredStocks.map((stock) => {
            // Logarithmic scale for node size
            // Smaller sizes for 500+ nodes: 2-20px (was 3-35px for 100 nodes)
            const logMin = Math.log(minCap || 1);
            const logMax = Math.log(maxCap || 1);
            const logCap = Math.log(stock.market_cap || 1);
            const normalizedSize = logMax > logMin ? (logCap - logMin) / (logMax - logMin) : 0.5;

            // Dynamic size range based on node count
            const minSize = isFullIndex ? 2 : 3;
            const maxSize = isFullIndex ? 18 : 32;
            const size = minSize + normalizedSize * (maxSize - minSize);

            // Color based on change_percent
            let color;
            if (stock.change_percent > 0) {
                const intensity = Math.min(stock.change_percent / 3, 1);
                color = `rgb(0, ${Math.floor(150 + intensity * 105)}, 0)`;
            } else if (stock.change_percent < 0) {
                const intensity = Math.min(Math.abs(stock.change_percent) / 3, 1);
                color = `rgb(${Math.floor(150 + intensity * 105)}, 0, 0)`;
            } else {
                color = '#808080';
            }

            return {
                id: stock.ticker,
                name: stock.name,
                ticker: stock.ticker,
                sector: stock.sector,
                marketCap: stock.market_cap,
                price: stock.price,
                changePercent: stock.change_percent,
                weight: stock.weight,
                size: size,
                color: color,
                // Initial random position - wider spread for more nodes
                x: (Math.random() - 0.5) * dimensions.width * (isFullIndex ? 0.8 : 0.6),
                y: (Math.random() - 0.5) * dimensions.height * (isFullIndex ? 0.8 : 0.6)
            };
        });

        // Create constellation links between stocks in the same sector
        const links = [];
        const sectorGroups = {};

        nodes.forEach(node => {
            if (!sectorGroups[node.sector]) {
                sectorGroups[node.sector] = [];
            }
            sectorGroups[node.sector].push(node);
        });

        // Create optimized constellation pattern for each sector
        // Reduced links for 500 nodes to improve performance
        Object.entries(sectorGroups).forEach(([sector, sectorNodes]) => {
            if (sectorNodes.length < 2) return;

            // Sort by market cap to create hierarchy
            const sorted = [...sectorNodes].sort((a, b) => b.marketCap - a.marketCap);

            // For large sectors, only connect top nodes to hub
            const hub = sorted[0];
            const maxConnections = isFullIndex ? Math.min(sorted.length - 1, 8) : sorted.length - 1;

            // Connect the largest node to top N others (star pattern)
            for (let i = 1; i <= maxConnections; i++) {
                links.push({
                    source: hub.id,
                    target: sorted[i].id,
                    sector: sector,
                    opacity: 0.35
                });
            }

            // Add minimal cross-connections for constellation effect (max 2-3)
            const crossConnections = isFullIndex ? 2 : 4;
            for (let i = 1; i < Math.min(sorted.length - 1, crossConnections + 1); i++) {
                links.push({
                    source: sorted[i].id,
                    target: sorted[i + 1].id,
                    sector: sector,
                    opacity: 0.2
                });
            }
        });

        setGraphData({ nodes, links });
    }, [stocks, sectorFilter, dimensions]);

    // Configure physics forces - optimized for 500 nodes
    useEffect(() => {
        if (!graphRef.current || graphData.nodes.length === 0) return;

        const isLargeGraph = graphData.nodes.length > 100;

        try {
            // Remove default center force
            graphRef.current.d3Force('center', null);

            // Charge force (repulsion) - stronger but with limited range for performance
            const chargeForce = graphRef.current.d3Force('charge');
            if (chargeForce) {
                if (isLargeGraph) {
                    // Stronger repulsion with limited range for 500+ nodes
                    chargeForce
                        .strength(-60)
                        .distanceMax(200);  // Only compute for nearby nodes
                } else {
                    chargeForce.strength(-30);
                }
            }

            // Collision detection - slightly smaller padding for dense graphs
            graphRef.current.d3Force('collision',
                forceCollide()
                    .radius(node => (node.size || 5) + (isLargeGraph ? 1 : 2))
                    .strength(0.95)
            );

            // Centering forces - slightly stronger for large graphs to prevent drift
            graphRef.current.d3Force('x', forceX(0).strength(isLargeGraph ? 0.02 : 0.015));
            graphRef.current.d3Force('y', forceY(0).strength(isLargeGraph ? 0.02 : 0.015));

            // Link force for constellation connections
            const linkForce = graphRef.current.d3Force('link');
            if (linkForce) {
                linkForce
                    .distance(isLargeGraph ? 60 : 80)
                    .strength(isLargeGraph ? 0.02 : 0.03);
            }
        } catch (e) {
            console.warn('Error configuring physics:', e);
        }
    }, [graphData]);

    // Sector color map for constellation lines
    const sectorColors = {
        'Technology': '#00AAFF',
        'Information Technology': '#00AAFF',
        'Communication Services': '#FFD700',
        'Consumer Discretionary': '#FF6B6B',
        'Consumer Cyclical': '#FF6B6B',
        'Consumer Staples': '#90EE90',
        'Consumer Defensive': '#90EE90',
        'Health Care': '#DDA0DD',
        'Healthcare': '#DDA0DD',
        'Industrials': '#FFA500',
        'Utilities': '#87CEEB',
        'Energy': '#FF4500',
        'Financials': '#32CD32',
        'Financial Services': '#32CD32',
        'Real Estate': '#BA55D3',
        'Materials': '#CD853F'
    };

    // Custom node canvas rendering (pixelated squares - retro look)
    const paintNode = useCallback((node, ctx, globalScale) => {
        const size = node.size || 5;

        // Draw as square (retro/pixelated look)
        ctx.fillStyle = node.color || '#808080';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.5 / globalScale;

        // Draw square
        ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
        ctx.strokeRect(node.x - size / 2, node.y - size / 2, size, size);

        // Draw ticker label only for large nodes at reasonable zoom
        // More restrictive for 500 nodes to reduce visual clutter
        if (size > 10 && globalScale > 0.5) {
            ctx.font = `bold ${Math.max(6, size / 4)}px Courier New`;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.ticker || '', node.x, node.y);
        }
    }, []);

    // Custom link rendering
    const paintLink = useCallback((link, ctx, globalScale) => {
        const start = link.source;
        const end = link.target;

        if (!start.x || !end.x) return;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = sectorColors[link.sector] || 'rgba(128, 128, 128, 0.3)';
        ctx.globalAlpha = link.opacity || 0.25;
        ctx.lineWidth = 0.5 / globalScale;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }, []);

    // Handle node hover - pass to parent
    const handleNodeHover = useCallback((node) => {
        if (onNodeHover) {
            onNodeHover(node);
        }
    }, [onNodeHover]);

    // Determine warmup ticks based on graph size
    const warmupTicks = graphData.nodes.length > 100 ? 150 : 100;

    // Show loading state when no data
    if (graphData.nodes.length === 0) {
        return (
            <div ref={containerRef} className="w-full h-full relative retro-inset flex items-center justify-center" style={{ backgroundColor: '#000020' }}>
                <div className="font-mono-retro text-green-400 text-center">
                    <div className="text-xl mb-2">LOADING S&P 500 DATA...</div>
                    <div className="text-sm text-gray-400">FETCHING MARKET DATA FROM API</div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full relative retro-inset">
            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeCanvasObject={paintNode}
                nodeCanvasObjectMode={() => 'replace'}
                linkCanvasObject={paintLink}
                linkCanvasObjectMode={() => 'replace'}
                onNodeHover={handleNodeHover}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                enableNodeDrag={true}
                enableZoomPanInteraction={true}
                cooldownTicks={100}
                cooldownTime={3000}
                warmupTicks={warmupTicks}
                d3AlphaDecay={0.05}
                d3VelocityDecay={0.4}
                backgroundColor="#000020"
            />
        </div>
    );
}
