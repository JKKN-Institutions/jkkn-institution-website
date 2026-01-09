import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { findParentNode } from '@tiptap/core'
import type { EditorState, Transaction } from '@tiptap/pm/state'

export const TableCellMerge = Extension.create({
  name: 'tableCellMerge',

  addCommands() {
    return {
      /**
       * Merge selected cells horizontally
       */
      mergeCellsHorizontal:
        () =>
        ({ state, dispatch, tr }: { state: EditorState; dispatch?: (tr: Transaction) => void; tr: Transaction }) => {
          const { selection } = state

          // Find the table cell
          const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

          if (!cellPos) return false

          const cell = cellPos.node
          const cellAttrs = cell.attrs

          // Get current colspan or default to 1
          const currentColspan = cellAttrs.colspan || 1

          // Set colspan to current + 1 (merge with next cell)
          const newColspan = currentColspan + 1

          if (dispatch) {
            tr.setNodeMarkup(cellPos.pos, undefined, {
              ...cellAttrs,
              colspan: newColspan,
            })
            dispatch(tr)
          }

          return true
        },

      /**
       * Merge selected cells vertically
       */
      mergeCellsVertical:
        () =>
        ({ state, dispatch, tr }: { state: EditorState; dispatch?: (tr: Transaction) => void; tr: Transaction }) => {
          const { selection } = state

          // Find the table cell
          const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

          if (!cellPos) return false

          const cell = cellPos.node
          const cellAttrs = cell.attrs

          // Get current rowspan or default to 1
          const currentRowspan = cellAttrs.rowspan || 1

          // Set rowspan to current + 1 (merge with cell below)
          const newRowspan = currentRowspan + 1

          if (dispatch) {
            tr.setNodeMarkup(cellPos.pos, undefined, {
              ...cellAttrs,
              rowspan: newRowspan,
            })
            dispatch(tr)
          }

          return true
        },

      /**
       * Split a merged cell back to original
       */
      splitCell:
        () =>
        ({ state, dispatch, tr }: { state: EditorState; dispatch?: (tr: Transaction) => void; tr: Transaction }) => {
          const { selection } = state

          // Find the table cell
          const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

          if (!cellPos) return false

          const cell = cellPos.node
          const cellAttrs = cell.attrs

          // Check if cell is merged
          const colspan = cellAttrs.colspan || 1
          const rowspan = cellAttrs.rowspan || 1

          if (colspan === 1 && rowspan === 1) {
            // Cell is not merged, nothing to split
            return false
          }

          if (dispatch) {
            // Reset colspan and rowspan to 1
            tr.setNodeMarkup(cellPos.pos, undefined, {
              ...cellAttrs,
              colspan: 1,
              rowspan: 1,
            })
            dispatch(tr)
          }

          return true
        },

      /**
       * Check if cells can be merged
       */
      canMergeCells:
        () =>
        ({ state }: { state: EditorState }) => {
          const { selection } = state

          // Find the table cell
          const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

          return cellPos !== undefined
        },

      /**
       * Check if current cell can be split
       */
      canSplitCell:
        () =>
        ({ state }: { state: EditorState }) => {
          const { selection } = state

          // Find the table cell
          const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

          if (!cellPos) return false

          const cell = cellPos.node
          const cellAttrs = cell.attrs

          const colspan = cellAttrs.colspan || 1
          const rowspan = cellAttrs.rowspan || 1

          return colspan > 1 || rowspan > 1
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tableCellMergePlugin'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const { doc, selection } = state

            // Find current table cell
            const cellPos = findParentNode((node) => node.type.name === 'tableCell' || node.type.name === 'tableHeader')(selection)

            if (cellPos) {
              const cell = cellPos.node
              const cellAttrs = cell.attrs

              // Add visual indicator for merged cells
              if ((cellAttrs.colspan && cellAttrs.colspan > 1) || (cellAttrs.rowspan && cellAttrs.rowspan > 1)) {
                decorations.push(
                  Decoration.node(cellPos.pos, cellPos.pos + cell.nodeSize, {
                    class: 'merged-cell',
                  })
                )
              }
            }

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },

  // Keyboard shortcuts commented out due to TypeScript declaration issues
  // Commands are available via the Table Properties dialog
  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Shift-m': () => this.editor.commands.mergeCellsHorizontal(),
  //     'Mod-Shift-v': () => this.editor.commands.mergeCellsVertical(),
  //     'Mod-Shift-s': () => this.editor.commands.splitCell(),
  //   }
  // },
})

export default TableCellMerge
