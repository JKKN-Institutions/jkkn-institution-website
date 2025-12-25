'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNavSubmenuProps } from './types';
import { usePathname } from 'next/navigation';

// Fast spring for container
const containerSpring = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
  mass: 0.8
};

export function BottomNavSubmenu({
  items,
  groups,
  isOpen,
  onItemClick
}: BottomNavSubmenuProps) {
  const pathname = usePathname();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Check if we should render grouped or flat items
  const hasGroups = groups && groups.length > 0;

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            height: containerSpring,
            opacity: { duration: 0.12 }
          }}
          className="absolute bottom-full left-0 right-0 bg-background shadow-lg border border-border rounded-t-xl overflow-hidden"
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{
              y: { type: 'spring', stiffness: 500, damping: 30 },
              opacity: { duration: 0.1 }
            }}
            className="p-3 max-h-[60vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Grouped submenu (Content-style) */}
            {hasGroups ? (
              <div className="space-y-2">
                {groups.map((group) => {
                  const isGroupExpanded = expandedGroup === group.id;
                  const GroupIcon = group.icon;
                  const hasActiveItem = group.items.some(
                    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
                  );

                  return (
                    <div key={group.id} className="rounded-xl overflow-hidden">
                      {/* Group header */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-xl',
                          'transition-colors duration-200',
                          hasActiveItem
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted/50 text-foreground hover:bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
                              hasActiveItem ? 'bg-primary/20' : 'bg-background'
                            )}
                          >
                            <GroupIcon
                              className="h-4 w-4"
                              strokeWidth={hasActiveItem ? 2.5 : 2}
                            />
                          </div>
                          <span className="font-medium text-sm">{group.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {group.items.length}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </motion.button>

                      {/* Group items */}
                      <AnimatePresence>
                        {isGroupExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-3 gap-2 pt-2 pb-1">
                              {group.items.map((item, index) => {
                                const isActive =
                                  pathname === item.href ||
                                  pathname.startsWith(item.href + '/');
                                const Icon = item.icon;

                                return (
                                  <motion.button
                                    key={item.href}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                      transition: { delay: index * 0.02 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onItemClick(item.href)}
                                    className={cn(
                                      'flex flex-col items-center justify-center p-3 rounded-xl',
                                      'transition-colors duration-200',
                                      'active:bg-accent',
                                      isActive
                                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                        : 'text-muted-foreground bg-muted/30'
                                    )}
                                  >
                                    <Icon
                                      className="h-5 w-5 mb-1"
                                      strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span
                                      className={cn(
                                        'text-[10px] text-center leading-tight line-clamp-2',
                                        isActive && 'font-semibold'
                                      )}
                                    >
                                      {item.label}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Flat submenu (default) */
              <div className="grid grid-cols-3 gap-2">
                {items.map((item, index) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, scale: 0.9, y: 8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        delay: index * 0.02
                      }}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02, backgroundColor: 'var(--accent)' }}
                      onClick={() => onItemClick(item.href)}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-xl',
                        'transition-colors duration-200',
                        'active:bg-accent',
                        isActive
                          ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                          : 'text-muted-foreground bg-muted/30'
                      )}
                    >
                      <motion.div
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          rotate: isActive ? [0, -3, 3, 0] : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon
                          className="h-5 w-5 mb-1"
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </motion.div>
                      <span
                        className={cn(
                          'text-[10px] text-center leading-tight line-clamp-2',
                          isActive && 'font-semibold'
                        )}
                      >
                        {item.label}
                      </span>
                      {item.parentLabel && (
                        <span className="text-[8px] text-muted-foreground/70 mt-0.5 truncate max-w-full">
                          {item.parentLabel}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
