'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';

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
  color?: string; // Custom accent color
}

interface BottomSheetNavBarProps {
  modules: ParentModule[];
  activeModuleId?: string;
  activeSubModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  onSubModuleClick?: (moduleId: string, subModuleId: string) => void;
  className?: string;
}

export function BottomSheetNavBar({
  modules,
  activeModuleId,
  activeSubModuleId,
  onModuleClick,
  onSubModuleClick,
  className = '',
}: BottomSheetNavBarProps) {
  const [sheetModuleId, setSheetModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState(activeModuleId || modules[0]?.id);
  const [activeSubModule, setActiveSubModule] = useState(activeSubModuleId);
  const sheetRef = useRef<HTMLDivElement>(null);

  const sheetModule = modules.find((m) => m.id === sheetModuleId);
  const isSheetOpen = !!sheetModuleId;

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetModuleId(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  const handleModuleClick = useCallback((module: ParentModule) => {
    if (module.subModules && module.subModules.length > 0) {
      setSheetModuleId((prev) => (prev === module.id ? null : module.id));
    } else {
      setActiveModule(module.id);
      setActiveSubModule(undefined);
      setSheetModuleId(null);
      onModuleClick?.(module.id);
      module.onClick?.();
    }
  }, [onModuleClick]);

  const handleSubModuleClick = useCallback((subModule: SubModule) => {
    if (!sheetModuleId) return;

    setActiveModule(sheetModuleId);
    setActiveSubModule(subModule.id);
    setSheetModuleId(null);
    onSubModuleClick?.(sheetModuleId, subModule.id);
    subModule.onClick?.();
  }, [sheetModuleId, onSubModuleClick]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isSheetOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setSheetModuleId(null)}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed left-0 right-0 bottom-0 z-50
          bg-white rounded-t-3xl shadow-2xl
          transition-transform duration-300 ease-out
          ${isSheetOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ 
          maxHeight: '70vh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
        }}
        role="dialog"
        aria-modal="true"
        aria-label={sheetModule?.label}
      >
        {sheetModule && (
          <>
            {/* Sheet Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 z-10">
              {/* Drag Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${sheetModule.color || 'bg-primary-500'}`}>
                    <sheetModule.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {sheetModule.label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {sheetModule.subModules?.length} items
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSheetModuleId(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Sheet Content - Submodules List */}
            <div className="overflow-y-auto px-4 py-2" style={{ maxHeight: 'calc(70vh - 120px)' }}>
              <div className="space-y-2">
                {sheetModule.subModules?.map((subModule) => {
                  const SubIcon = subModule.icon;
                  const isActive = activeSubModule === subModule.id && activeModule === sheetModule.id;

                  return (
                    <button
                      key={subModule.id}
                      onClick={() => handleSubModuleClick(subModule)}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-2xl
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }
                      `}
                    >
                      {SubIcon && (
                        <div className={`
                          p-3 rounded-xl
                          ${isActive ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}
                        `}>
                          <SubIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                            {subModule.label}
                          </span>
                          {subModule.badge !== undefined && subModule.badge > 0 && (
                            <span className="min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {subModule.badge > 99 ? '99+' : subModule.badge}
                            </span>
                          )}
                        </div>
                        {subModule.description && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {subModule.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-30 ${className}`}
        role="navigation"
        aria-label="Main navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-around px-2 h-16">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              const isExpanded = sheetModuleId === module.id;
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
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  aria-current={isActive && !hasSubModules ? 'page' : undefined}
                  aria-expanded={hasSubModules ? isExpanded : undefined}
                  aria-haspopup={hasSubModules ? 'dialog' : undefined}
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

                  {/* Active indicator */}
                  {(isActive || isExpanded) && (
                    <div className="absolute bottom-1 w-1 h-1 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export default BottomSheetNavBar;
