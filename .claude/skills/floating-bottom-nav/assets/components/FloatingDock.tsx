'use client';

import { useState } from 'react';

interface DockItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  href?: string;
}

interface FloatingDockProps {
  items: DockItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function FloatingDock({ 
  items, 
  activeId,
  onItemClick,
  className = ''
}: FloatingDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [active, setActive] = useState(activeId || items[0]?.id);

  const getScale = (itemId: string, index: number) => {
    if (!hoveredId) return 1;
    const hoveredIndex = items.findIndex(item => item.id === hoveredId);
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    return 1;
  };

  const handleClick = (item: DockItem) => {
    setActive(item.id);
    onItemClick?.(item.id);
  };

  return (
    <nav 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-end gap-1 px-4 py-3 bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        {items.map((item, index) => {
          const Icon = item.icon;
          const scale = getScale(item.id, index);
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(item)}
              className="relative flex flex-col items-center transition-all duration-200 ease-out origin-bottom"
              style={{ transform: `scale(${scale})` }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`
                p-3 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                }
              `}>
                <Icon className="w-6 h-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Tooltip on hover */}
              {hoveredId === item.id && (
                <span className="absolute -top-10 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in">
                  {item.label}
                </span>
              )}
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="w-1 h-1 bg-white rounded-full mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default FloatingDock;
