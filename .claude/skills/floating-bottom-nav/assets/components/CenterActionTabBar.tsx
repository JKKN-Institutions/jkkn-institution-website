'use client';

import { Plus } from 'lucide-react';

interface TabItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface CenterActionTabBarProps {
  leftTabs: TabItem[];
  rightTabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onCenterAction: () => void;
  centerIcon?: React.ComponentType<{ className?: string }>;
  centerColor?: string;
  className?: string;
}

export function CenterActionTabBar({ 
  leftTabs,
  rightTabs,
  activeTab, 
  onTabChange,
  onCenterAction,
  centerIcon: CenterIcon = Plus,
  centerColor = 'from-primary-500 to-primary-600',
  className = ''
}: CenterActionTabBarProps) {

  const renderTab = (tab: TabItem) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`
          flex flex-col items-center justify-center flex-1 py-2 min-w-[64px]
          transition-all duration-200
          focus:outline-none focus:bg-gray-100/50
          ${isActive 
            ? 'text-primary-600' 
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
        <span className={`text-xs mt-1 transition-all ${isActive ? 'font-semibold' : 'font-medium'}`}>
          {tab.label}
        </span>
        {isActive && (
          <div className="absolute bottom-1 w-1 h-1 bg-primary-500 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
      role="navigation"
      aria-label="Main navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="relative bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg shadow-black/5">
        <div className="flex items-center justify-around px-2 h-16">
          {/* Left Tabs */}
          <div className="flex flex-1 justify-around">
            {leftTabs.map(renderTab)}
          </div>
          
          {/* Spacer for center button */}
          <div className="w-16 flex-shrink-0" />
          
          {/* Right Tabs */}
          <div className="flex flex-1 justify-around">
            {rightTabs.map(renderTab)}
          </div>
        </div>
        
        {/* Center Action Button */}
        <button
          onClick={onCenterAction}
          className={`
            absolute left-1/2 -translate-x-1/2 -top-6
            w-14 h-14 rounded-full
            bg-gradient-to-br ${centerColor}
            text-white shadow-lg shadow-primary-500/40
            flex items-center justify-center
            transition-all duration-200
            hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
          `}
          aria-label="Create new"
        >
          <CenterIcon className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}

export default CenterActionTabBar;
