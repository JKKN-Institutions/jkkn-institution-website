'use client';

/**
 * College CMS Admin Panel - Mobile Navigation Example
 * 
 * This file demonstrates how to use the hierarchical navigation
 * components for your college CMS admin panel with the following modules:
 * - Dashboard
 * - User Management
 * - Website Pages
 * - Activities
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity,
  // Dashboard submodules
  BarChart3,
  TrendingUp,
  Bell,
  // User Management submodules
  UserPlus,
  UserCog,
  Shield,
  Key,
  // Pages submodules
  Plus,
  List,
  Navigation,
  Image,
  Settings,
  Layers,
  // Activities submodules
  Clock,
  Search,
  Download,
} from 'lucide-react';

// Import your preferred navigation component
import { HierarchicalNavBar } from './HierarchicalNavBar';
import { MorphingNavBar } from './MorphingNavBar';
import { BottomSheetNavBar } from './BottomSheetNavBar';

// Define your CMS modules structure
export const cmsModules = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'bg-blue-500',
    subModules: [
      { 
        id: 'overview', 
        label: 'Overview', 
        icon: BarChart3,
        description: 'View key metrics and statistics'
      },
      { 
        id: 'analytics', 
        label: 'Analytics', 
        icon: TrendingUp,
        description: 'Detailed traffic and engagement data'
      },
      { 
        id: 'notifications', 
        label: 'Notifications', 
        icon: Bell,
        badge: 5,
        description: 'System alerts and updates'
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    color: 'bg-green-500',
    badge: 3,
    subModules: [
      { 
        id: 'all-users', 
        label: 'All Users', 
        icon: Users,
        description: 'View and manage all users'
      },
      { 
        id: 'add-user', 
        label: 'Add User', 
        icon: UserPlus,
        description: 'Create new user account'
      },
      { 
        id: 'roles', 
        label: 'Roles', 
        icon: Shield,
        description: 'Manage user roles and permissions'
      },
      { 
        id: 'permissions', 
        label: 'Permissions', 
        icon: Key,
        description: 'Configure access controls'
      },
    ],
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FileText,
    color: 'bg-purple-500',
    subModules: [
      { 
        id: 'all-pages', 
        label: 'All Pages', 
        icon: List,
        description: 'View and manage all pages'
      },
      { 
        id: 'create-page', 
        label: 'Create Page', 
        icon: Plus,
        description: 'Build a new page'
      },
      { 
        id: 'components', 
        label: 'Components', 
        icon: Layers,
        description: 'Reusable page components'
      },
      { 
        id: 'navigation', 
        label: 'Navigation', 
        icon: Navigation,
        description: 'Manage site menus'
      },
      { 
        id: 'media', 
        label: 'Media', 
        icon: Image,
        badge: 12,
        description: 'Images, videos, and files'
      },
      { 
        id: 'settings', 
        label: 'Settings', 
        icon: Settings,
        description: 'Page and SEO settings'
      },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: Activity,
    color: 'bg-orange-500',
    subModules: [
      { 
        id: 'recent', 
        label: 'Recent', 
        icon: Clock,
        description: 'Latest activity log'
      },
      { 
        id: 'search-activities', 
        label: 'Search', 
        icon: Search,
        description: 'Find specific activities'
      },
      { 
        id: 'export', 
        label: 'Export', 
        icon: Download,
        description: 'Download activity reports'
      },
    ],
  },
];

/**
 * Example 1: Using HierarchicalNavBar
 * Best for: Quick access with popup panel
 */
export function CMSNavExample1() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeSubModule, setActiveSubModule] = useState('overview');

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    console.log('Module clicked:', moduleId);
    // Navigate to module route
  };

  const handleSubModuleClick = (moduleId: string, subModuleId: string) => {
    setActiveModule(moduleId);
    setActiveSubModule(subModuleId);
    console.log('SubModule clicked:', moduleId, subModuleId);
    // Navigate to submodule route
  };

  return (
    <HierarchicalNavBar
      modules={cmsModules}
      activeModuleId={activeModule}
      activeSubModuleId={activeSubModule}
      onModuleClick={handleModuleClick}
      onSubModuleClick={handleSubModuleClick}
    />
  );
}

/**
 * Example 2: Using MorphingNavBar
 * Best for: Floating glassmorphism style with inline submodules
 */
export function CMSNavExample2() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeSubModule, setActiveSubModule] = useState('overview');

  return (
    <MorphingNavBar
      modules={cmsModules}
      activeModuleId={activeModule}
      activeSubModuleId={activeSubModule}
      onModuleClick={(moduleId) => {
        setActiveModule(moduleId);
        // router.push(`/admin/${moduleId}`);
      }}
      onSubModuleClick={(moduleId, subModuleId) => {
        setActiveModule(moduleId);
        setActiveSubModule(subModuleId);
        // router.push(`/admin/${moduleId}/${subModuleId}`);
      }}
    />
  );
}

/**
 * Example 3: Using BottomSheetNavBar
 * Best for: Rich submodule displays with descriptions
 */
export function CMSNavExample3() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeSubModule, setActiveSubModule] = useState('overview');

  return (
    <BottomSheetNavBar
      modules={cmsModules}
      activeModuleId={activeModule}
      activeSubModuleId={activeSubModule}
      onModuleClick={(moduleId) => {
        setActiveModule(moduleId);
      }}
      onSubModuleClick={(moduleId, subModuleId) => {
        setActiveModule(moduleId);
        setActiveSubModule(subModuleId);
      }}
    />
  );
}

/**
 * Example 4: Integration with Next.js App Router
 */
export function CMSNavWithRouter() {
  // In real implementation, use usePathname and useRouter
  // import { usePathname, useRouter } from 'next/navigation';
  
  const pathname = '/admin/pages/all-pages'; // Example: usePathname();
  
  // Parse active module and submodule from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const activeModule = pathParts[1] || 'dashboard';
  const activeSubModule = pathParts[2] || undefined;

  const handleNavigation = (moduleId: string, subModuleId?: string) => {
    const path = subModuleId 
      ? `/admin/${moduleId}/${subModuleId}`
      : `/admin/${moduleId}`;
    
    // router.push(path);
    console.log('Navigate to:', path);
  };

  return (
    <BottomSheetNavBar
      modules={cmsModules}
      activeModuleId={activeModule}
      activeSubModuleId={activeSubModule}
      onModuleClick={(moduleId) => handleNavigation(moduleId)}
      onSubModuleClick={(moduleId, subModuleId) => handleNavigation(moduleId, subModuleId)}
    />
  );
}

/**
 * Default export for demonstration
 */
export default function CollegeCMSMobileNav() {
  const [navType, setNavType] = useState<'hierarchical' | 'morphing' | 'sheet'>('sheet');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Demo Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">College CMS Admin</h1>
        
        {/* Navigation Type Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Navigation Style:</label>
          <select 
            value={navType}
            onChange={(e) => setNavType(e.target.value as any)}
            className="ml-2 p-2 border rounded-lg"
          >
            <option value="hierarchical">Popup Panel</option>
            <option value="morphing">Morphing (Floating)</option>
            <option value="sheet">Bottom Sheet</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">
            Click on the navigation items below to see submodules.
            Try Dashboard, Users, Pages, or Activities.
          </p>
        </div>
      </div>

      {/* Navigation Component */}
      {navType === 'hierarchical' && <CMSNavExample1 />}
      {navType === 'morphing' && <CMSNavExample2 />}
      {navType === 'sheet' && <CMSNavExample3 />}
    </div>
  );
}
