'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TableEditorProps {
  headers: string[]
  rows: string[][]
  onChange: (data: { headers: string[]; rows: string[][] }) => void
  className?: string
}

export function TableEditor({ headers, rows, onChange, className }: TableEditorProps) {
  // Handle header changes
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers]
    newHeaders[index] = value
    onChange({ headers: newHeaders, rows })
  }

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`]
    const newRows = rows.map((row) => [...row, ''])
    onChange({ headers: newHeaders, rows: newRows })
  }

  const deleteColumn = (index: number) => {
    if (headers.length <= 1) return // Minimum 1 column
    const newHeaders = headers.filter((_, i) => i !== index)
    const newRows = rows.map((row) => row.filter((_, i) => i !== index))
    onChange({ headers: newHeaders, rows: newRows })
  }

  // Handle row changes
  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    const newRows = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === cellIndex ? value : cell))
        : row
    )
    onChange({ headers, rows: newRows })
  }

  const addRow = () => {
    const newRow = Array(headers.length).fill('')
    onChange({ headers, rows: [...rows, newRow] })
  }

  const deleteRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index)
    onChange({ headers, rows: newRows })
  }

  const moveRowUp = (index: number) => {
    if (index === 0) return
    const newRows = [...rows]
    ;[newRows[index - 1], newRows[index]] = [newRows[index], newRows[index - 1]]
    onChange({ headers, rows: newRows })
  }

  const moveRowDown = (index: number) => {
    if (index === rows.length - 1) return
    const newRows = [...rows]
    ;[newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]]
    onChange({ headers, rows: newRows })
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Headers Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Table Headers</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Column
          </Button>
        </div>

        <div className="grid gap-2 max-h-[120px] overflow-y-auto">
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={header}
                onChange={(e) => updateHeader(index, e.target.value)}
                placeholder={`Column ${index + 1}`}
                className="h-8 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => deleteColumn(index)}
                disabled={headers.length <= 1}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Rows Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Table Rows ({rows.length})</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Row
          </Button>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
            No rows yet. Click "Add Row" to create your first row.
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {rows.map((row, rowIndex) => (
              <Card key={rowIndex} className="p-3">
                <div className="space-y-2">
                  {/* Row header with controls */}
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Row {rowIndex + 1}
                    </Label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveRowUp(rowIndex)}
                        disabled={rowIndex === 0}
                        className="h-6 w-6 p-0"
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveRowDown(rowIndex)}
                        disabled={rowIndex === rows.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(rowIndex)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Cell inputs */}
                  <div className="grid gap-2">
                    {row.map((cell, cellIndex) => (
                      <div key={cellIndex} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          {headers[cellIndex] || `Column ${cellIndex + 1}`}
                        </Label>
                        <Input
                          value={cell}
                          onChange={(e) =>
                            updateCell(rowIndex, cellIndex, e.target.value)
                          }
                          placeholder={`Enter ${headers[cellIndex] || 'value'}...`}
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
