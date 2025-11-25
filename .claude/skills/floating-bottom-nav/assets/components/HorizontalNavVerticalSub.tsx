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
  badge?: number;
  subModules?: SubModule[];
}

interface HorizontalNavVerticalSubProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  className?: string;
}

export function HorizontalNavVerticalSub({
  modules,
  activeModuleId,
  activeSubModuleId,
  onModuleClick,
  onSubModuleClick,
  className = '',
}: HorizontalNavVerticalSubProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);

  const expandedModule = modules.find((m) => m.id === expandedModuleId);
  const expandedModuleIndex = modules.findIndex((m) => m.id === expandedModuleId);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedModuleId(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleModuleClick = useCallback((module: ParentModule) => {
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModuleId((prev) => (prev === module.id ? null : module.id));
    } else {
      setActiveModule(module.id);
      setActiveSubModule(undefined);
      setExpandedModuleId(null);
      onModuleClick?.(module.id);
    }
  }, [onModuleClick]);

  const handleSubModuleClick = useCallback((moduleId: string, subModule: SubModule) => {
    setActiveModule(moduleId);
    setActiveSubModule(subModule.id);
    setExpandedModuleId(null);
    onSubModuleClick?.(moduleId, subModule.id);
    subModule.onClick?.();
  }, [onSubModuleClick]);

  return (
    <>
      {/* Backdrop when expanded */}
      {expandedModuleId && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Vertical Floating Submodules with Icons + Hover Labels */}
      {expandedModule && expandedModule.subModules && (
        <div 
          className="fixed z-50 flex flex-col-reverse items-center gap-2"
          style={{
            bottom: '6rem',
            // Perfect alignment calculation - directly above parent module
            left: `${((expandedModuleIndex + 0.5) / modules.length) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {expandedModule.subModules.map((subModule, index) => {
            const SubIcon = subModule.icon;
            const isActive = activeSubModule === subModule.id && activeModule === expandedModule.id;

            return (
              <div key={subModule.id} className="relative group">
                {/* Icon Button */}
                <button
                  onClick={() => handleSubModuleClick(expandedModule.id, subModule)}
                  className={`
                    relative w-14 h-14 rounded-2xl
                    flex items-center justify-center
                    shadow-xl border transition-all duration-300 ease-out
                    ${isActive
                      ? `${expandedModule.color || 'bg-blue-500'} text-white border-transparent scale-110`
                      : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:scale-110 hover:shadow-2xl'
                    }
                  `}
                  style={{
                    animation: `floatUp 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <SubIcon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  
                  {/* Badge */}
                  {subModule.badge !== undefined && subModule.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10">
                      {subModule.badge > 99 ? '99+' : subModule.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip Label - Appears on Hover (Closer Distance) */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-none z-50">
                  <div className={`
                    px-3 py-2 rounded-lg shadow-2xl border
                    transition-all duration-200
                    ${isActive
                      ? `${expandedModule.color || 'bg-blue-500'} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200'
                    }
                    opacity-0 group-hover:opacity-100
                    scale-95 group-hover:scale-100
                    translate-x-1 group-hover:translate-x-0
                  `}>
                    <span className="font-medium text-sm whitespace-nowrap">
                      {subModule.label}
                    </span>
                    {/* Arrow */}
                    <div className={`
                      absolute right-full top-1/2 -translate-y-1/2
                      border-[6px] border-transparent
                      ${isActive 
                        ? 'border-r-current' 
                        : 'border-r-white'
                      }
                    `} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Horizontal Bottom Navigation Bar - Floating with Rounded Corners */}
      <nav
        className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-3xl">
          <div className="flex items-center justify-around px-4 h-16">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              const isExpanded = expandedModuleId === module.id;
              const hasSubModules = module.subModules && module.subModules.length > 0;

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`
                    relative flex flex-col items-center justify-center
                    flex-1 py-2 min-h-[56px]
                    transition-all duration-200
                    ${isActive || isExpanded
                      ? module.color?.replace('bg-', 'text-') || 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  aria-current={isActive && !hasSubModules ? 'page' : undefined}
                  aria-expanded={hasSubModules ? isExpanded : undefined}
                >
                  <div className="relative">
                    <Icon className={`w-6 h-6 transition-transform ${isActive || isExpanded ? 'scale-110' : ''}`} />
                    {module.badge !== undefined && module.badge > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {module.badge > 9 ? '9+' : module.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isActive || isExpanded ? 'font-semibold' : 'font-medium'}`}>
                    {module.label}
                  </span>

                  {/* Active/Expanded indicator */}
                  {(isActive || isExpanded) && (
                    <div className={`absolute bottom-1 h-1 rounded-full ${module.color || 'bg-blue-500'} ${isExpanded ? 'w-6' : 'w-1'} transition-all`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default HorizontalNavVerticalSub;
