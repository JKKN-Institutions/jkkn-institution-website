'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight } from 'lucide-react';

// Types
export interface SubModule {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
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

interface VerticalFloatingNavProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  position?: 'left' | 'right';
  className?: string;
}

export function VerticalFloatingNav({
  modules,
  activeModuleId,
  activeSubModuleId,
  onSubModuleClick,
  position = 'right',
  className = '',
}: VerticalFloatingNavProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);

  const expandedModule = modules.find((m) => m.id === expandedModuleId);

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

  const positionClasses = position === 'right' 
    ? 'right-4' 
    : 'left-4';

  const subModulePosition = position === 'right'
    ? 'right-full mr-3'
    : 'left-full ml-3';

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-50 ${className}`}>
      {/* Backdrop when expanded */}
      {expandedModuleId && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Main Vertical Button Stack */}
      <div className="flex flex-col-reverse gap-3">
        {modules.map((module, index) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          const isExpanded = expandedModuleId === module.id;

          return (
            <div key={module.id} className="relative">
              {/* Submodules - Vertical Floating Stack */}
              {isExpanded && module.subModules && (
                <div 
                  className={`absolute bottom-0 ${subModulePosition} flex flex-col-reverse gap-2`}
                  style={{ minWidth: '160px' }}
                >
                  {module.subModules.map((subModule, subIndex) => {
                    const SubIcon = subModule.icon;
                    const isSubActive = activeSubModule === subModule.id && activeModule === module.id;

                    return (
                      <button
                        key={subModule.id}
                        onClick={() => handleSubModuleClick(module.id, subModule)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl
                          shadow-lg border transition-all duration-300 ease-out
                          ${isSubActive
                            ? 'bg-primary-500 text-white border-primary-500 shadow-primary-500/30'
                            : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:shadow-xl'
                          }
                        `}
                        style={{
                          animation: `slideIn 0.3s ease-out ${subIndex * 0.05}s both`,
                        }}
                      >
                        {SubIcon && (
                          <SubIcon className={`w-5 h-5 flex-shrink-0 ${isSubActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                        <span className="font-medium text-sm whitespace-nowrap flex-1 text-left">
                          {subModule.label}
                        </span>
                        {subModule.badge !== undefined && subModule.badge > 0 && (
                          <span className={`
                            min-w-5 h-5 px-1.5 text-xs rounded-full flex items-center justify-center font-bold
                            ${isSubActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
                          `}>
                            {subModule.badge > 99 ? '99+' : subModule.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Module Label Header */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                    <Icon className={`w-4 h-4 ${module.color?.replace('bg-', 'text-') || 'text-primary-500'}`} />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {module.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Parent Module Button */}
              <button
                onClick={() => handleModuleClick(module)}
                className={`
                  relative w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  shadow-lg transition-all duration-300 ease-out
                  ${isExpanded
                    ? 'bg-gray-800 text-white rotate-0 scale-110'
                    : isActive
                      ? `${module.color || 'bg-primary-500'} text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-xl hover:scale-105'
                  }
                `}
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                }}
                aria-expanded={isExpanded}
                aria-label={module.label}
              >
                {isExpanded ? (
                  <X className="w-6 h-6" />
                ) : (
                  <>
                    <Icon className="w-6 h-6" />
                    {/* Badge on parent */}
                    {module.subModules.some(s => s.badge && s.badge > 0) && !isExpanded && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(${position === 'right' ? '20px' : '-20px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default VerticalFloatingNav;
