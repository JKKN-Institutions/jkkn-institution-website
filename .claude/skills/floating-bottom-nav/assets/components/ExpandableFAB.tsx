'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface FABAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color?: string;
}

interface ExpandableFABProps {
  actions: FABAction[];
  position?: 'center' | 'right' | 'left';
  mainIcon?: React.ComponentType<{ className?: string }>;
  mainColor?: string;
  showBackdrop?: boolean;
  className?: string;
}

export function ExpandableFAB({ 
  actions, 
  position = 'center',
  mainIcon: MainIcon = Plus,
  mainColor = 'from-primary-500 to-primary-600',
  showBackdrop = true,
  className = ''
}: ExpandableFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-6',
    left: 'left-6',
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleActionClick = useCallback((action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  }, []);

  return (
    <div className={`fixed bottom-6 ${positionClasses[position]} z-50 ${className}`}>
      {/* Backdrop */}
      {showBackdrop && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Action Buttons */}
      <div 
        className="flex flex-col-reverse items-center gap-3 mb-3"
        role="menu"
        aria-hidden={!isOpen}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-full
                bg-white shadow-lg border border-gray-100
                transition-all duration-300 ease-out
                hover:shadow-xl hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-primary-500/50
                ${isOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
                }
              `}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              tabIndex={isOpen ? 0 : -1}
              role="menuitem"
            >
              <div className={`p-2 rounded-full ${action.color || 'bg-primary-500'}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 pr-2">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full
          bg-gradient-to-br ${mainColor}
          text-white shadow-lg shadow-primary-500/40
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-primary-500/50 hover:scale-105
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
          ${isOpen ? 'rotate-45' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MainIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}

export default ExpandableFAB;
