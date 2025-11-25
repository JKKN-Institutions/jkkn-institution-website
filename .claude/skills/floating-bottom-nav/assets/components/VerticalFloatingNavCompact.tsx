'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

// Types
export interface SubModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

export interface ParentModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  subModules: SubModule[];
}

interface VerticalFloatingNavCompactProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  position?: 'left' | 'right';
  className?: string;
}

export function VerticalFloatingNavCompact({
  modules,
  activeModuleId,
  activeSubModuleId,
  onSubModuleClick,
  position = 'right',
  className = '',
}: VerticalFloatingNavCompactProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);
  const [hoveredSubModule, setHoveredSubModule] = useState<string | null>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedModuleId(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleModuleClick = useCallback((module: ParentModule) => {
    setExpandedModuleId((prev) => (prev === module.id ? null : module.id));
  }, []);

  const handleSubModuleClick = useCallback((moduleId: string, subModule: SubModule) => {
    setActiveModule(moduleId);
    setActiveSubModule(subModule.id);
    setExpandedModuleId(null);
    onSubModuleClick?.(moduleId, subModule.id);
    subModule.onClick?.();
  }, [onSubModuleClick]);

  const positionClasses = position === 'right' ? 'right-4' : 'left-4';
  const tooltipPosition = position === 'right' ? 'right-full mr-3' : 'left-full ml-3';

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-50 ${className}`}>
      {/* Backdrop */}
      {expandedModuleId && (
        <div 
          className="fixed inset-0 bg-black/10 -z-10"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Vertical Stack */}
      <div className="flex flex-col-reverse items-center gap-3">
        {modules.map((module, moduleIndex) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          const isExpanded = expandedModuleId === module.id;
          const hasBadge = module.subModules.some(s => s.badge && s.badge > 0);

          return (
            <div key={module.id} className="relative flex flex-col-reverse items-center">
              {/* Expanded Submodules - Vertical Icons */}
              {isExpanded && (
                <div className="flex flex-col-reverse gap-2 mb-3">
                  {module.subModules.map((subModule, subIndex) => {
                    const SubIcon = subModule.icon;
                    const isSubActive = activeSubModule === subModule.id && activeModule === module.id;
                    const isHovered = hoveredSubModule === subModule.id;

                    return (
                      <div key={subModule.id} className="relative">
                        {/* Tooltip */}
                        <div 
                          className={`
                            absolute ${tooltipPosition} top-1/2 -translate-y-1/2
                            px-3 py-2 bg-gray-900 text-white text-sm font-medium
                            rounded-lg whitespace-nowrap
                            transition-all duration-200
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
                          `}
                        >
                          {subModule.label}
                          {/* Arrow */}
                          <div 
                            className={`
                              absolute top-1/2 -translate-y-1/2 w-0 h-0
                              border-8 border-transparent
                              ${position === 'right' 
                                ? 'left-full border-l-gray-900' 
                                : 'right-full border-r-gray-900'
                              }
                            `}
                          />
                        </div>

                        {/* Submodule Button */}
                        <button
                          onClick={() => handleSubModuleClick(module.id, subModule)}
                          onMouseEnter={() => setHoveredSubModule(subModule.id)}
                          onMouseLeave={() => setHoveredSubModule(null)}
                          className={`
                            relative w-12 h-12 rounded-xl
                            flex items-center justify-center
                            shadow-lg transition-all duration-300 ease-out
                            ${isSubActive
                              ? `${module.color || 'bg-primary-500'} text-white shadow-lg`
                              : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-110'
                            }
                          `}
                          style={{
                            animation: `popIn 0.3s ease-out ${subIndex * 0.05}s both`,
                          }}
                        >
                          <SubIcon className="w-5 h-5" />
                          {subModule.badge !== undefined && subModule.badge > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                              {subModule.badge > 9 ? '9+' : subModule.badge}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Parent Module Button */}
              <button
                onClick={() => handleModuleClick(module)}
                className={`
                  relative w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  shadow-xl transition-all duration-300 ease-out
                  ${isExpanded
                    ? 'bg-gray-800 text-white scale-110'
                    : isActive
                      ? `${module.color || 'bg-primary-500'} text-white`
                      : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-105'
                  }
                `}
                aria-expanded={isExpanded}
                aria-label={module.label}
              >
                {isExpanded ? (
                  <X className="w-6 h-6" />
                ) : (
                  <>
                    <Icon className="w-6 h-6" />
                    {hasBadge && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default VerticalFloatingNavCompact;
