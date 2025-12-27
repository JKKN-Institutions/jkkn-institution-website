import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageGalleryView } from './image-gallery-view'

export interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (attrs: { images: GalleryImage[]; layout?: 'carousel' | 'grid'; columns?: number }) => ReturnType
      updateGalleryImages: (images: GalleryImage[]) => ReturnType
    }
  }
}

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: 'imageGallery',

  group: 'block',

  atom: true, // Treat as single unit

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const data = element.getAttribute('data-images')
          try {
            return data ? JSON.parse(data) : []
          } catch {
            return []
          }
        },
        renderHTML: attributes => ({
          'data-images': JSON.stringify(attributes.images),
        }),
      },
      layout: {
        default: 'carousel',
        parseHTML: element => element.getAttribute('data-layout') || 'carousel',
        renderHTML: attributes => ({
          'data-layout': attributes.layout,
        }),
      },
      columns: {
        default: 3,
        parseHTML: element => {
          const cols = element.getAttribute('data-columns')
          return cols ? parseInt(cols, 10) : 3
        },
        renderHTML: attributes => ({
          'data-columns': String(attributes.columns),
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-gallery"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'image-gallery',
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryView)
  },

  addCommands() {
    return {
      setImageGallery:
        (attrs) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run()
        },
      updateGalleryImages:
        (images) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === 'imageGallery' && dispatch) {
            tr.setNodeMarkup(selection.from, undefined, {
              ...node.attrs,
              images,
            })
            return true
          }
          return false
        },
    }
  },
})
