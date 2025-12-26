'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BottomNavMoreMenuProps } from './types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export function BottomNavMoreMenu({
  groups,
  isOpen,
  onClose,
  onItemClick
}: BottomNavMoreMenuProps) {
  const pathname = usePathname();

  const handleItemClick = (href: string) => {
    onItemClick(href);
    onClose();
  };

  // Handle main menu click (for items without submenus)
  const handleMainMenuClick = (e: React.MouseEvent, href: string, hasSubmenus: boolean) => {
    if (!hasSubmenus) {
      e.preventDefault();
      e.stopPropagation();
      handleItemClick(href);
    }
  };

  // Get items with submenus (for accordion) and items without (direct navigation)
  const itemsWithSubmenus = groups.filter((item) => item.submenus.length > 0);
  const itemsWithoutSubmenus = groups.filter((item) => item.submenus.length === 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[80vh] rounded-t-3xl flex flex-col z-[100]"
      >
        <SheetHeader className="pb-2 flex-shrink-0">
          <SheetTitle className="text-lg font-semibold">All Menus</SheetTitle>
        </SheetHeader>

        {/* Custom scrollable area with hidden scrollbar */}
        <div
          className="flex-1 overflow-y-auto pb-8 px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Accordion for items WITH submenus */}
          {itemsWithSubmenus.length > 0 && (
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={itemsWithSubmenus.map((item) => item.id)}
            >
              {itemsWithSubmenus.map((item) => {
                const Icon = item.icon;

                return (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-b border-border/30"
                  >
                    <AccordionTrigger
                      className={cn(
                        'py-3 hover:no-underline',
                        item.active && 'text-primary'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            item.active ? 'bg-primary/10' : 'bg-muted'
                          )}
                        >
                          <Icon
                            className="h-4 w-4"
                            strokeWidth={item.active ? 2.5 : 2}
                          />
                        </div>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto mr-2">
                          {item.submenus.length}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="grid grid-cols-3 gap-2 pt-2 pb-3">
                        {item.submenus.map((submenu, index) => {
                          const isActive =
                            pathname === submenu.href ||
                            pathname.startsWith(submenu.href + '/');
                          const SubIcon = submenu.icon;

                          return (
                            <motion.button
                              key={submenu.href}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                transition: { delay: index * 0.02 }
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleItemClick(submenu.href)}
                              className={cn(
                                'flex flex-col items-center justify-center p-3 rounded-lg',
                                'transition-colors duration-200',
                                'active:bg-accent',
                                isActive
                                  ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                  : 'text-muted-foreground bg-muted/30'
                              )}
                            >
                              <SubIcon
                                className="h-5 w-5 mb-1"
                                strokeWidth={isActive ? 2.5 : 2}
                              />
                              <span
                                className={cn(
                                  'text-[10px] text-center leading-tight line-clamp-2',
                                  isActive && 'font-semibold'
                                )}
                              >
                                {submenu.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {/* Direct navigation items WITHOUT submenus */}
          {itemsWithoutSubmenus.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Quick Access
              </div>
              <div className="grid grid-cols-3 gap-2">
                {itemsWithoutSubmenus.map((item, index) => {
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
                      onClick={() => handleItemClick(item.href)}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-lg',
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
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
