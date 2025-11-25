'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

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
  href?: string;
  onClick?: () => void;
  badge?: number;
  subModules?: SubModule[];
}

interface HierarchicalNavBarProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  className?: string;
}

export function HierarchicalNavBar({
  modules,
  activeModuleId,
  activeSubModuleId,
  onModuleClick,
  onSubModuleClick,
  className = '',
}: HierarchicalNavBarProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);

  const expandedModule = modules.find((m) => m.id === expandedModuleId);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedModuleId(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!expandedModuleId) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-nav-container]')) {
        setExpandedModuleId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expandedModuleId]);

  const handleModuleClick = useCallback((module: ParentModule) => {
    // If module has submodules, toggle expansion
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModuleId((prev) => (prev === module.id ? null : module.id));
    } else {
      // No submodules, directly navigate
      setActiveModule(module.id);
      setActiveSubModule(undefined);
      setExpandedModuleId(null);
      onModuleClick?.(module.id);
      module.onClick?.();
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
    <div data-nav-container className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      {/* Backdrop when expanded */}
      {expandedModuleId && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Submodules Panel */}
      <div
        className={`
          absolute bottom-full left-0 right-0 
          transition-all duration-300 ease-out
          ${expandedModuleId 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
        `}
      >
        {expandedModule && expandedModule.subModules && (
          <div className="mx-4 mb-2 p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50">
            {/* Header */}
            <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {expandedModule.icon && (
                  <expandedModule.icon className="w-5 h-5 text-primary-600" />
                )}
                <span className="font-semibold text-gray-800">
                  {expandedModule.label}
                </span>
              </div>
              <button
                onClick={() => setExpandedModuleId(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close submenu"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Submodules Grid */}
            <div className="grid grid-cols-3 gap-2">
              {expandedModule.subModules.map((subModule) => {
                const SubIcon = subModule.icon;
                const isActive = activeSubModule === subModule.id && activeModule === expandedModule.id;

                return (
                  <button
                    key={subModule.id}
                    onClick={() => handleSubModuleClick(expandedModule.id, subModule)}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-xl
                      transition-all duration-200
                      ${isActive
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {SubIcon && <SubIcon className="w-5 h-5" />}
                    <span className="text-xs font-medium text-center leading-tight">
                      {subModule.label}
                    </span>
                    {subModule.badge !== undefined && subModule.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {subModule.badge > 99 ? '99+' : subModule.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Bar */}
      <nav
        className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg"
        role="navigation"
        aria-label="Main navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-2 h-16">
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
                  ${isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={hasSubModules ? isExpanded : undefined}
                aria-haspopup={hasSubModules ? 'menu' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {module.badge !== undefined && module.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {module.badge > 9 ? '9+' : module.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-0.5 mt-1">
                  <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {module.label}
                  </span>
                  {hasSubModules && (
                    isExpanded 
                      ? <ChevronDown className="w-3 h-3" />
                      : <ChevronUp className="w-3 h-3" />
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default HierarchicalNavBar;
