'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { NavItem } from './site-header'

interface NavMobileItemProps {
  item: NavItem
  level: number
  parentPath: string[]
  onPathChange: (path: string[]) => void
  onItemClick: () => void
  pathname: string
  isActive: (href: string) => boolean
  openDropdownPath: string[]
}

export function NavMobileItem({
  item,
  level,
  parentPath,
  onPathChange,
  onItemClick,
  pathname,
  isActive,
  openDropdownPath
}: NavMobileItemProps) {
  const currentPath = [...parentPath, item.id]
  const isOpen = openDropdownPath.slice(0, currentPath.length)
    .every((id, i) => id === currentPath[i])
  const hasChildren = item.children && item.children.length > 0

  // Calculate indentation (limit to max 3 levels for visual clarity)
  const visualLevel = Math.min(level, 3)
  const indentClass = visualLevel > 0 ? `pl-${visualLevel * 4}` : ''

  const handleClick = () => {
    if (hasChildren) {
      // Toggle expand/collapse
      onPathChange(isOpen ? parentPath : currentPath)
    } else {
      // Close mobile menu only for leaf items (no children)
      onItemClick()
    }
  }

  return (
    <div className={cn('border-b border-gray-100 last:border-b-0', level > 0 && 'border-b-0')}>
      {hasChildren ? (
        <div>
          <button
            onClick={handleClick}
            className={cn(
              'w-full flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
              indentClass,
              isActive(item.href)
                ? 'text-primary'
                : 'text-gray-700 hover:text-primary'
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </button>

          {/* Nested children with progressive indentation */}
          <div className={cn(
            'overflow-hidden transition-all duration-200',
            isOpen ? 'max-h-[2000px] pb-2' : 'max-h-0'
          )}>
            <div className={cn(
              'border-l-2 border-primary/30 ml-2',
              level > 0 && `ml-${visualLevel * 4 + 2}`
            )}>
              {item.children!.map((child) => (
                <NavMobileItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  parentPath={currentPath}
                  onPathChange={onPathChange}
                  onItemClick={onItemClick}
                  pathname={pathname}
                  isActive={isActive}
                  openDropdownPath={openDropdownPath}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        item.external_url ? (
          <a
            href={item.external_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onItemClick}
            className={cn(
              'block py-2 text-sm transition-colors',
              indentClass,
              level > 0 ? 'pl-4' : 'py-3 font-semibold uppercase tracking-wide',
              isActive(item.href)
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
            )}
          >
            {item.label}
          </a>
        ) : (
          <Link
            href={item.href}
            onClick={handleClick}
            className={cn(
              'block py-2 text-sm transition-colors',
              indentClass,
              level > 0 ? 'pl-4' : 'py-3 font-semibold uppercase tracking-wide',
              isActive(item.href)
                ? 'text-primary font-medium'
                : level > 0 ? 'text-gray-600 hover:text-primary' : 'text-gray-700 hover:text-primary'
            )}
          >
            {item.label}
          </Link>
        )
      )}
    </div>
  )
}
