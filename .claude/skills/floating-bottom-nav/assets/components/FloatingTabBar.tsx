'use client';

import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

interface FloatingTabBarProps {
  items: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function FloatingTabBar({ 
  items, 
  activeId, 
  onItemClick,
  className = ''
}: FloatingTabBarProps) {
  const [active, setActive] = useState(activeId || items[0]?.id);

  const handleClick = (item: NavItem) => {
    setActive(item.id);
    onItemClick?.(item.id);
    item.onClick?.();
  };

  return (
    <nav 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/10">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`
                flex flex-col items-center justify-center
                min-w-[60px] px-3 py-2 rounded-xl
                transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-primary-500/20 text-primary-600 scale-105' 
                  : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default FloatingTabBar;
