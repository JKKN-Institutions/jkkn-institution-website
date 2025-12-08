'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Fragment } from 'react'

export interface BreadcrumbItemData {
  label: string
  href?: string
}

export interface ShadcnBreadcrumbBlockProps {
  items?: BreadcrumbItemData[]
  separator?: string
}

export function ShadcnBreadcrumbBlock({
  items = [],
  separator = '/',
}: ShadcnBreadcrumbBlockProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No breadcrumb items configured.
      </div>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default ShadcnBreadcrumbBlock
