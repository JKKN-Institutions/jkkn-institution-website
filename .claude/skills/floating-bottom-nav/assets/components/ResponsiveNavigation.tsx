import React, { useState } from 'react';

/**
 * ResponsiveNavigation Component
 * 
 * A comprehensive navigation system that automatically switches between:
 * - Desktop: Full vertical sidebar with expandable submodules
 * - Mobile: Floating bottom navigation with vertical icon-only submodules
 * 
 * Features:
 * - Automatic responsive switching at lg breakpoint (1024px)
 * - Glassmorphism design
 * - Badge support
 * - Active state management
 * - Collapsible sidebar on desktop
 * - Hover tooltips on mobile
 */

interface NavSubModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string; // Tailwind class like 'bg-blue-500'
  badge?: number;
  subModules?: NavSubModule[];
}

interface ResponsiveNavigationProps {
  modules: NavModule[];
  activeModule: string;
  activeSubModule?: string;
  onModuleChange: (moduleId: string) => void;
  onSubModuleChange?: (moduleId: string, subModuleId: string) => void;
  logo?: React.ReactNode;
  userAvatar?: React.ReactNode;
  className?: string;
}

export default function ResponsiveNavigation({
  modules,
  activeModule,
  activeSubModule,
  onModuleChange,
  onSubModuleChange,
  logo,
  userAvatar,
  className = '',
}: ResponsiveNavigationProps) {
  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={`hidden lg:block ${className}`}>
        <DesktopSidebar
          modules={modules}
          activeModule={activeModule}
          activeSubModule={activeSubModule}
          onModuleChange={onModuleChange}
          onSubModuleChange={onSubModuleChange}
          logo={logo}
          userAvatar={userAvatar}
        />
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className={`lg:hidden ${className}`}>
        <MobileBottomNav
          modules={modules}
          activeModule={activeModule}
          activeSubModule={activeSubModule}
          onModuleChange={onModuleChange}
          onSubModuleChange={onSubModuleChange}
        />
      </div>
    </>
  );
}

/**
 * Desktop Sidebar Component
 * 
 * Full vertical sidebar for desktop screens (≥1024px)
 * - Fixed left position
 * - Collapsible (280px ↔ 80px)
 * - Expandable submodules with nested indent
 * - Labels always visible (when not collapsed)
 */

interface DesktopSidebarProps {
  modules: NavModule[];
  activeModule: string;
  activeSubModule?: string;
  onModuleChange: (moduleId: string) => void;
  onSubModuleChange?: (moduleId: string, subModuleId: string) => void;
  logo?: React.ReactNode;
  userAvatar?: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function DesktopSidebar({
  modules,
  activeModule,
  activeSubModule,
  onModuleChange,
  onSubModuleChange,
  logo,
  userAvatar,
  defaultCollapsed = false,
}: DesktopSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedModules, setExpandedModules] = useState<string[]>([activeModule]);

  const handleModuleClick = (module: NavModule) => {
    onModuleChange(module.id);
    
    // Toggle expansion
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModules(prev =>
        prev.includes(module.id)
          ? prev.filter(id => id !== module.id)
          : [...prev, module.id]
      );
    }
  };

  const handleSubModuleClick = (moduleId: string, subModuleId: string) => {
    onSubModuleChange?.(moduleId, subModuleId);
  };

  const ChevronRight = ({ className = '' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  const Settings = ({ className = '' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {logo || (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">L</span>
            </div>
          )}
          {!collapsed && (
            <div>
              <h1 className="text-white font-bold">CMS Admin</h1>
              <p className="text-white/50 text-xs">Control Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          const isExpanded = expandedModules.includes(module.id);

          return (
            <div key={module.id}>
              {/* Parent Module */}
              <button
                onClick={() => handleModuleClick(module)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? `${module.color || 'bg-blue-500'} text-white shadow-lg`
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left font-medium text-sm">{module.label}</span>
                    {module.badge && module.badge > 0 && (
                      <span className="min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {module.badge > 99 ? '99+' : module.badge}
                      </span>
                    )}
                    {module.subModules && module.subModules.length > 0 && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submodules */}
              {!collapsed && isExpanded && module.subModules && module.subModules.length > 0 && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-3">
                  {module.subModules.map((subModule) => {
                    const SubIcon = subModule.icon;
                    const isSubActive = activeSubModule === subModule.id && activeModule === module.id;

                    return (
                      <button
                        key={subModule.id}
                        onClick={() => handleSubModuleClick(module.id, subModule.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isSubActive
                            ? 'bg-white/20 text-white font-medium'
                            : 'text-white/50 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span className="flex-1 text-left">{subModule.label}</span>
                        {subModule.badge && subModule.badge > 0 && (
                          <span className="min-w-4 h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {subModule.badge > 99 ? '99+' : subModule.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings & Toggle */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-left font-medium text-sm">Settings</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <svg
            className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* User Avatar */}
      {userAvatar && !collapsed && (
        <div className="p-3 border-t border-white/10">
          {userAvatar}
        </div>
      )}
    </div>
  );
}

/**
 * Mobile Bottom Navigation Component
 * 
 * Floating bottom navigation for mobile screens (<1024px)
 * - Fixed bottom position with rounded corners
 * - Horizontal parent modules
 * - Vertical icon-only submodules with hover tooltips
 * - Click outside to close
 */

interface MobileBottomNavProps {
  modules: NavModule[];
  activeModule: string;
  activeSubModule?: string;
  onModuleChange: (moduleId: string) => void;
  onSubModuleChange?: (moduleId: string, subModuleId: string) => void;
}

export function MobileBottomNav({
  modules,
  activeModule,
  activeSubModule,
  onModuleChange,
  onSubModuleChange,
}: MobileBottomNavProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const expandedModule = modules.find(m => m.id === expandedModuleId);
  const expandedModuleIndex = modules.findIndex(m => m.id === expandedModuleId);

  const handleModuleClick = (module: NavModule) => {
    onModuleChange(module.id);
    
    if (module.subModules && module.subModules.length > 0) {
      setExpandedModuleId(expandedModuleId === module.id ? null : module.id);
    }
  };

  const handleSubModuleClick = (moduleId: string, subModuleId: string) => {
    onSubModuleChange?.(moduleId, subModuleId);
    setExpandedModuleId(null);
  };

  return (
    <>
      {/* Backdrop */}
      {expandedModuleId && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setExpandedModuleId(null)}
        />
      )}

      {/* Vertical Floating Submodules */}
      {expandedModule && expandedModule.subModules && expandedModule.subModules.length > 0 && (
        <div
          className="fixed z-50 flex flex-col-reverse items-center gap-2"
          style={{
            bottom: '6.5rem',
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
                  onClick={() => handleSubModuleClick(expandedModule.id, subModule.id)}
                  className={`
                    relative w-14 h-14 rounded-2xl
                    flex items-center justify-center
                    shadow-xl border transition-all duration-300 ease-out
                    ${
                      isActive
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
                  {subModule.badge && subModule.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10">
                      {subModule.badge > 99 ? '99+' : subModule.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip Label - Appears on Hover */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-none z-50">
                  <div
                    className={`
                    px-3 py-2 rounded-lg shadow-2xl border
                    transition-all duration-200
                    ${
                      isActive
                        ? `${expandedModule.color || 'bg-blue-500'} text-white border-transparent`
                        : 'bg-white text-gray-700 border-gray-200'
                    }
                    opacity-0 group-hover:opacity-100
                    scale-95 group-hover:scale-100
                    translate-x-1 group-hover:translate-x-0
                  `}
                  >
                    <span className="font-medium text-sm whitespace-nowrap">{subModule.label}</span>
                    {/* Arrow */}
                    <div
                      className={`
                      absolute right-full top-1/2 -translate-y-1/2
                      border-[6px] border-transparent
                      ${isActive ? 'border-r-current' : 'border-r-white'}
                    `}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
          <div className="flex items-center justify-around px-4 h-16">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              const isExpanded = expandedModuleId === module.id;
              const textColor = module.color?.replace('bg-', 'text-') || 'text-blue-500';

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`
                    relative flex flex-col items-center justify-center
                    flex-1 py-2 min-h-[56px] transition-all duration-200
                    ${isActive || isExpanded ? textColor : 'text-white/50'}
                  `}
                >
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-transform ${
                        isActive || isExpanded ? 'scale-110' : ''
                      }`}
                    />
                    {module.badge && module.badge > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {module.badge > 9 ? '9+' : module.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isActive || isExpanded ? 'font-semibold text-white' : 'font-medium'
                    }`}
                  >
                    {module.label}
                  </span>

                  {/* Active indicator */}
                  {(isActive || isExpanded) && (
                    <div
                      className={`absolute -bottom-0.5 h-1 rounded-full ${module.color || 'bg-blue-500'} ${
                        isExpanded ? 'w-8' : 'w-4'
                      } transition-all duration-300`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CSS Animation */}
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

// Export individual components
export { DesktopSidebar, MobileBottomNav };
