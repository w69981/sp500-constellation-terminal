import { useState } from 'react';

/**
 * RetroWindow - Windows 95 style draggable window component
 * Features: Title bar with gradient, minimize button, beveled borders
 * Supports disableDrag for mobile/responsive layouts
 */
export default function RetroWindow({
    title,
    children,
    defaultPosition = { x: 20, y: 20 },
    width = 'auto',
    minWidth = '200px',
    className = '',
    disableDrag = false
}) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState(defaultPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (disableDrag) return;
        if (e.target.closest('.retro-button')) return;
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || disableDrag) return;
        setPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Static position style (no absolute positioning in mobile)
    const positionStyle = disableDrag
        ? { width, minWidth }
        : {
            position: 'absolute',
            left: position.x,
            top: position.y,
            width,
            minWidth,
            zIndex: isDragging ? 1000 : 10
        };

    return (
        <div
            className={`retro-window ${disableDrag ? '' : 'absolute'} ${className}`}
            style={positionStyle}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Title Bar */}
            <div
                className="retro-titlebar"
                onMouseDown={handleMouseDown}
                style={{ cursor: disableDrag ? 'default' : 'move' }}
            >
                <span className="font-serif-retro text-[10px] sm:text-sm tracking-wide">{title}</span>
                <div className="flex gap-1">
                    <button
                        className="retro-button retro-button-small"
                        onClick={() => setIsMinimized(!isMinimized)}
                        title={isMinimized ? "Restore" : "Minimize"}
                    >
                        _
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {!isMinimized && (
                <div className="p-2">
                    {children}
                </div>
            )}
        </div>
    );
}
