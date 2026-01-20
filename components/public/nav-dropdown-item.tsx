'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { NavItem } from './site-header'

interface NavDropdownItemProps {
  item: NavItem
  level: number
  parentPath: string[]
  onPathChange: (path: string[]) => void
  onHover?: (itemId: string | null, parentPath?: string[]) => void
  pathname: string
  isActive: (href: string) => boolean
  isActiveOrHasActiveChild?: (item: NavItem) => boolean
  textSize?: string
  openDropdownPath: string[]
}

export function NavDropdownItem({
  item,
  level,
  parentPath,
  onPathChange,
  onHover,
  pathname,
  isActive,
  isActiveOrHasActiveChild,
  textSize = 'text-xs xl:text-sm',
  openDropdownPath
}: NavDropdownItemProps) {
  const currentPath = [...parentPath, item.id]
  const isOpen = openDropdownPath.length >= currentPath.length &&
    openDropdownPath.slice(0, currentPath.length)
      .every((id, i) => id === currentPath[i])
  const hasChildren = item.children && item.children.length > 0

  // Ref and state for overflow detection (level 0 dropdowns only)
  const containerRef = useRef<HTMLDivElement>(null)
  const [alignRight, setAlignRight] = useState(false)

  // Detect if dropdown would overflow viewport and align right if needed
  useEffect(() => {
    if (level === 0 && hasChildren && isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      // Check if this is a mega menu (has children with children)
      const isMegaMenu = item.children?.some(child => child.children && child.children.length > 0)
      // Use maximum width: 432px for mega menu, 224px for simple dropdown
      const dropdownWidth = isMegaMenu ? 432 : 224
      const wouldOverflow = rect.left + dropdownWidth > window.innerWidth
      setAlignRight(wouldOverflow)
    }
  }, [level, hasChildren, isOpen, item.children])

  // Hover handlers - use global coordinator if available, otherwise fallback to local
  const handleMouseEnter = () => {
    if (hasChildren) {
      if (onHover) {
        // Use global hover coordinator (prevents multiple dropdowns)
        onHover(item.id, parentPath)
      } else {
        // Fallback to direct path change
        onPathChange(currentPath)
      }
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    // For level 0 items with mega menus, be more lenient with mouse leave
    if (level === 0 && item.children?.some(child => child.children && child.children.length > 0)) {
      // Don't close immediately - the dropdown will handle its own hover
      return
    }

    // Don't close if mouse is moving to the dropdown content
    const relatedTarget = e.relatedTarget as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement

    // If mouse is moving to a child element (the dropdown), don't close
    if (relatedTarget && relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) {
      return
    }

    if (onHover) {
      // Use global hover coordinator
      onHover(null, parentPath)
    } else {
      // Fallback to direct path change
      if (level === 0) {
        onPathChange([])
      } else {
        onPathChange(parentPath)
      }
    }
  }

  // For first level (level 0), show as main nav item
  if (level === 0) {
    return (
      <div
        ref={containerRef}
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onPathChange(isOpen ? [] : currentPath)}
            className={cn(
              'flex items-center gap-1 px-1 xl:px-2 py-2 font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
              textSize,
              isOpen
                ? 'text-primary border-primary'
                : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
            )}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-controls={`dropdown-${item.id}`}
          >
            {item.label}
            <ChevronDown className={cn(
              'h-3 w-3 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </button>
        ) : (
          <Link
            href={item.external_url || item.href}
            {...(item.external_url && { target: '_blank', rel: 'noopener noreferrer' })}
            className={cn(
              'flex items-center gap-1 px-1 xl:px-2 py-2 font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap border-b-2',
              textSize,
              (isActiveOrHasActiveChild ? isActiveOrHasActiveChild(item) : isActive(item.href))
                ? 'text-primary border-primary'
                : 'text-gray-800 hover:text-primary border-transparent hover:border-primary'
            )}
          >
            {item.label}
          </Link>
        )}

        {/* Dropdown for first level - Check if children have nested children (mega menu layout) */}
        {hasChildren && isOpen && (() => {
          // Pre-calculate if this is a mega menu and if a child is active
          const isMegaMenu = item.children!.some(child => child.children && child.children.length > 0)

          // Find the currently hovered/open child
          const displayChild = isMegaMenu ? item.children!.find(child =>
            openDropdownPath.length > currentPath.length &&
            openDropdownPath[currentPath.length] === child.id
          ) : null

          const hasActiveChild = displayChild && displayChild.children && displayChild.children.length > 0

          return (
            <div
              id={`dropdown-${item.id}`}
              className={cn(
                "absolute top-full origin-top z-50 transition-all duration-200",
                // Dynamic width based on active state
                isMegaMenu
                  ? hasActiveChild
                    ? "w-[432px]" // Expanded: w-52 (208px) + w-56 (224px) = 432px
                    : "w-56"      // Compact when no child is hovered
                  : "w-56",       // Standard width for simple dropdown
                alignRight ? "right-0" : "left-0"
              )}
              role="menu"
              aria-label={item.label}
              onMouseEnter={() => onHover?.(item.id, parentPath)}
              onMouseLeave={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement
                const currentTarget = e.currentTarget as HTMLElement
                if (!relatedTarget || !(relatedTarget instanceof Node) || !currentTarget.contains(relatedTarget)) {
                  onHover?.(null, parentPath)
                }
              }}
            >
              {/* Invisible bridge to prevent gap hover issues */}
              <div className="h-2" />
              <div className="bg-white rounded-lg shadow-xl shadow-black/15 border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 ease-out">
                {/* Check if this is a mega menu (children have children) */}
                {isMegaMenu ? (
                  // Mega Menu Layout - Two Columns (dynamic width, smooth transitions)
                  <div className="flex max-h-[calc(100vh-10rem)]">
                    {/* Left Column - Categories (Dynamic Width) */}
                    <div
                      className={cn(
                        "bg-gray-50 py-1 overflow-y-auto overflow-x-hidden transition-all duration-200",
                        hasActiveChild ? "w-52 border-r border-gray-200" : "w-full"
                      )}
                      onMouseLeave={(e) => {
                        // If mouse leaves left column, check if it's going to right column
                        const relatedTarget = e.relatedTarget as HTMLElement
                        const rightColumn = e.currentTarget.nextElementSibling
                        // Only clear if not going to right column
                        if (relatedTarget && rightColumn && !rightColumn.contains(relatedTarget)) {
                          const isLeavingDropdown = !e.currentTarget.closest('[role="menu"]')?.contains(relatedTarget)
                          if (isLeavingDropdown) {
                            onHover?.(null, parentPath)
                          }
                        }
                      }}
                    >
                      {item.children!.map((child) => (
                        <NavDropdownItem
                          key={child.id}
                          item={child}
                          level={level + 1}
                          parentPath={currentPath}
                          onPathChange={onPathChange}
                          onHover={onHover}
                          pathname={pathname}
                          isActive={isActive}
                          isActiveOrHasActiveChild={isActiveOrHasActiveChild}
                          openDropdownPath={openDropdownPath}
                        />
                      ))}
                    </div>

                    {/* Right Column - Child Pages (Smooth slide and fade) */}
                    {hasActiveChild && (
                      <div
                        className="w-56 py-1 overflow-y-auto overflow-x-hidden animate-in slide-in-from-left-2 fade-in duration-200"
                        onMouseEnter={() => onHover?.(displayChild!.id, currentPath)}
                        onMouseLeave={(e) => {
                          // Only close if mouse is leaving the entire dropdown
                          const relatedTarget = e.relatedTarget as HTMLElement
                          const dropdownElement = e.currentTarget.closest('[role="menu"]')
                          if (dropdownElement && relatedTarget && !dropdownElement.contains(relatedTarget)) {
                            onHover?.(null, parentPath)
                          }
                        }}
                      >
                        {displayChild!.children!.map((grandchild) => (
                          <NavDropdownItem
                            key={grandchild.id}
                            item={grandchild}
                            level={level + 2}
                            parentPath={[...currentPath, displayChild!.id]}
                            onPathChange={onPathChange}
                            onHover={onHover}
                            pathname={pathname}
                            isActive={isActive}
                            isActiveOrHasActiveChild={isActiveOrHasActiveChild}
                            openDropdownPath={openDropdownPath}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                // Standard Single Column Layout
                <div className="py-1 max-h-[calc(100vh-10rem)] overflow-x-hidden overflow-y-auto">
                  {item.children!.map((child) => (
                    <NavDropdownItem
                      key={child.id}
                      item={child}
                      level={level + 1}
                      parentPath={currentPath}
                      onPathChange={onPathChange}
                      onHover={onHover}
                      pathname={pathname}
                      isActive={isActive}
                      isActiveOrHasActiveChild={isActiveOrHasActiveChild}
                      openDropdownPath={openDropdownPath}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          )
        })()}
      </div>
    )
  }

  // For nested levels (level 1+), show as dropdown item
  return (
    <div
      className="relative group"
      onMouseEnter={hasChildren ? handleMouseEnter : undefined}
      onMouseLeave={hasChildren ? handleMouseLeave : undefined}
    >
      {hasChildren ? (
        // Category item in mega menu (left column)
        <button
          type="button"
          onClick={() => onPathChange(isOpen ? parentPath : currentPath)}
          onMouseEnter={() => onHover?.(item.id, parentPath)}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-all duration-200',
            isOpen
              ? 'text-primary bg-primary/10 font-medium'
              : 'text-gray-700 hover:text-primary hover:bg-primary/5'
          )}
          role="menuitem"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <span className="truncate">{item.label}</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        </button>
      ) : (
        item.external_url ? (
          <a
            href={item.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-1.5 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 hover:translate-x-0.5 transition-all duration-200 truncate"
            role="menuitem"
            tabIndex={0}
          >
            {item.label}
          </a>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'block px-3 py-1.5 text-sm transition-all duration-200 truncate',
              isActive(item.href)
                ? 'text-primary bg-primary/10 font-medium'
                : 'text-gray-700 hover:text-primary hover:bg-primary/5 hover:translate-x-0.5'
            )}
            role="menuitem"
            tabIndex={0}
          >
            {item.label}
          </Link>
        )
      )}
    </div>
  )
}
