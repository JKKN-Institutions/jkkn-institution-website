'use client'

import { useRef, useCallback, useState } from 'react'
import Editor, { OnMount, BeforeMount, OnChange, Monaco } from '@monaco-editor/react'
// Monaco editor types - inline to avoid dependency issues
interface IMarkerData {
  severity: number
  message: string
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

// Use a more flexible editor type to avoid version mismatch issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MonacoEditor = any

// Monaco Uri type
type Uri = {
  toString: () => string
  path: string
  scheme: string
}
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2, Copy, Check, RotateCcw, Play } from 'lucide-react'
import { toast } from 'sonner'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string | number
  className?: string
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: boolean
  onValidate?: (markers: IMarkerData[]) => void
  placeholder?: string
}

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  height = '400px',
  className,
  readOnly = false,
  minimap = false,
  lineNumbers = true,
  onValidate,
  placeholder = '// Paste your component code here...',
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const editorRef = useRef<MonacoEditor | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const initialValueRef = useRef(value)

  // Configure Monaco before mount
  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    // Configure TypeScript/JavaScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
    })

    // Add React types for better autocomplete
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare namespace React {
        interface FC<P = {}> {
          (props: P): JSX.Element | null;
        }
        interface ReactNode {}
        interface CSSProperties {}
        function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
      }
      declare const React: typeof React;
      `,
      'ts:react.d.ts'
    )

    // Add common component prop types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      interface ComponentProps {
        className?: string;
        children?: React.ReactNode;
        style?: React.CSSProperties;
      }

      interface ImageProps extends ComponentProps {
        src: string;
        alt: string;
        width?: number;
        height?: number;
        fill?: boolean;
      }

      interface LinkProps extends ComponentProps {
        href: string;
        target?: string;
        rel?: string;
      }

      interface ButtonProps extends ComponentProps {
        onClick?: () => void;
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
        variant?: 'default' | 'outline' | 'ghost' | 'destructive';
        size?: 'default' | 'sm' | 'lg' | 'icon';
      }
      `,
      'ts:component-props.d.ts'
    )

    // Set diagnostics options
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })
  }, [])

  // Handle editor mount
  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor

      // Configure editor settings
      editor.updateOptions({
        wordWrap: 'on',
        minimap: { enabled: minimap },
        scrollBeyondLastLine: false,
        folding: true,
        lineNumbers: lineNumbers ? 'on' : 'off',
        renderLineHighlight: 'line',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 14,
        tabSize: 2,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
      })

      // Handle validation markers
      if (onValidate) {
        monaco.editor.onDidChangeMarkers((uris: readonly Uri[]) => {
          const uri = uris[0]
          if (uri) {
            const markers = monaco.editor.getModelMarkers({ resource: uri })
            onValidate(markers)
          }
        })
      }

      // Add keyboard shortcuts
      editor.addAction({
        id: 'format-document',
        label: 'Format Document',
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
        run: (ed: MonacoEditor) => {
          ed.getAction('editor.action.formatDocument')?.run()
        },
      })

      // Focus the editor
      editor.focus()
    },
    [minimap, lineNumbers, onValidate]
  )

  // Handle value change
  const handleChange: OnChange = useCallback(
    (newValue) => {
      const val = newValue || ''
      onChange(val)
      setHasChanges(val !== initialValueRef.current)
    },
    [onChange]
  )

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast.success('Code copied to clipboard')
    } catch {
      toast.error('Failed to copy code')
    }
  }, [value])

  // Reset to initial value
  const handleReset = useCallback(() => {
    onChange(initialValueRef.current)
    setHasChanges(false)
    toast.info('Code reset to initial value')
  }, [onChange])

  // Format document
  const handleFormat = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run()
    toast.success('Code formatted')
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Get theme for Monaco
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light'

  return (
    <div
      className={cn(
        'relative border rounded-xl overflow-hidden bg-card',
        isFullscreen && 'fixed inset-4 z-50 border-2',
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
          {hasChanges && (
            <span className="text-xs text-amber-500 font-medium">Modified</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            title="Copy code"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>

          {hasChanges && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleReset}
              title="Reset to initial"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleFormat}
            title="Format code (Shift+Alt+F)"
          >
            <Play className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={isFullscreen ? 'calc(100vh - 120px)' : height}
        language={language === 'tsx' ? 'typescript' : language}
        value={value}
        theme={monacoTheme}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        onChange={handleChange}
        options={{
          readOnly,
          placeholder,
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      />

      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  )
}

/**
 * Lightweight code display (read-only, syntax highlighted)
 */
export function CodeDisplay({
  code,
  language = 'typescript',
  maxHeight = '300px',
  className,
}: {
  code: string
  language?: string
  maxHeight?: string
  className?: string
}) {
  const { resolvedTheme } = useTheme()
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'light'

  return (
    <div className={cn('rounded-xl overflow-hidden border', className)}>
      <Editor
        height={maxHeight}
        language={language === 'tsx' ? 'typescript' : language}
        value={code}
        theme={monacoTheme}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'off',
          folding: false,
          renderLineHighlight: 'none',
          wordWrap: 'on',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  )
}
