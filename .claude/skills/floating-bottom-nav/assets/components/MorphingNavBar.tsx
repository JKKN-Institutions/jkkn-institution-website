'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

// Types
export interface SubModule {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: number;
  description?: string;
}

export interface ParentModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: number;
  subModules?: SubModule[];
}

interface MorphingNavBarProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  className?: string;
}

type ViewState = 'modules' | 'submodules';

export function MorphingNavBar({
  modules,
  activeModuleId,
  activeSubModuleId,
  onModuleClick,
  onSubModuleClick,
  className = '',
}: MorphingNavBarProps) {
  const [viewState, setViewState] = useState<ViewState>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  // Reset to modules view on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewState === 'submodules') {
        setViewState('modules');
        setSelectedModuleId(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [viewState]);

  const handleModuleClick = useCallback((module: ParentModule) => {
    if (module.subModules && module.subModules.length > 0) {
      // Has submodules - morph to show them
      setSelectedModuleId(module.id);
      setViewState('submodules');
    } else {
      // No submodules - direct navigation
      setActiveModule(module.id);
      setActiveSubModule(undefined);
      onModuleClick?.(module.id);
      module.onClick?.();
    }
  }, [onModuleClick]);

  const handleSubModuleClick = useCallback((subModule: SubModule) => {
    if (!selectedModuleId) return;
    
    setActiveModule(selectedModuleId);
    setActiveSubModule(subModule.id);
    setViewState('modules');
    setSelectedModuleId(null);
    onSubModuleClick?.(selectedModuleId, subModule.id);
    subModule.onClick?.();
  }, [selectedModuleId, onSubModuleClick]);

  const handleBack = useCallback(() => {
    setViewState('modules');
    setSelectedModuleId(null);
  }, []);

  return (
    <nav
      className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
        {/* Modules View */}
        <div
          className={`
            flex items-center justify-around px-2 h-16
            transition-all duration-300 ease-out
            ${viewState === 'modules'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-full absolute inset-0'
            }
          `}
        >
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            const hasSubModules = module.subModules && module.subModules.length > 0;

            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className={`
                  relative flex flex-col items-center justify-center
                  flex-1 py-2 min-h-[56px] rounded-xl mx-1
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-600'
                    : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                  }
                `}
                aria-current={isActive && !hasSubModules ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {module.badge !== undefined && module.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {module.badge > 9 ? '9+' : module.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {module.label}
                </span>
                
                {/* Submodule indicator dots */}
                {hasSubModules && (
                  <div className="flex gap-0.5 mt-0.5">
                    {module.subModules!.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-current opacity-50" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Submodules View */}
        <div
          className={`
            flex items-center h-16
            transition-all duration-300 ease-out
            ${viewState === 'submodules'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full absolute inset-0'
            }
          `}
        >
          {selectedModule && (
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                aria-label={`Back to ${selectedModule.label}`}
              >
                <ChevronLeft className="w-5 h-5" />
                <selectedModule.icon className="w-5 h-5 text-primary-600" />
              </button>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300/50" />

              {/* Submodules */}
              <div className="flex-1 flex items-center justify-around px-2 overflow-x-auto">
                {selectedModule.subModules?.map((subModule) => {
                  const SubIcon = subModule.icon;
                  const isActive = activeSubModule === subModule.id && activeModule === selectedModule.id;

                  return (
                    <button
                      key={subModule.id}
                      onClick={() => handleSubModuleClick(subModule)}
                      className={`
                        relative flex flex-col items-center justify-center
                        flex-1 py-2 min-w-[60px] max-w-[80px] rounded-xl mx-1
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary-500/20 text-primary-600'
                          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {SubIcon && <SubIcon className="w-5 h-5" />}
                      <span className={`text-[10px] mt-1 text-center leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                        {subModule.label}
                      </span>
                      {subModule.badge !== undefined && subModule.badge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {subModule.badge > 9 ? '9+' : subModule.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MorphingNavBar;
