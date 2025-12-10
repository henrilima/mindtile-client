"use client";

import { Code as CodeIcon } from "lucide-react";
import type { CanvasElement } from "@/manager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Editor from "react-simple-code-editor";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "dart", label: "Dart" },
  { value: "csharp", label: "C#" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "cpp", label: "C++" },
  { value: "plaintext", label: "Texto" },
];

export function CodeElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const language = element.props?.language || "javascript";

  if (mode === "view") {
    return (
      <div className="w-full my-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {LANGUAGES.find((l) => l.value === language)?.label || language}
          </span>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}
          >
            {element.content || ""}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  const FONT_STYLE = {
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: "14px",
    lineHeight: "1.5",
    fontVariantLigatures: "none",
  };

  return (
    <div className="w-full rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/40 border-b border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-500">
          <CodeIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Editor de Código</span>
        </div>
        <Select
          value={language}
          onValueChange={(val) =>
            onUpdate?.(element.id, {
              props: { ...element.props, language: val },
            })
          }
        >
          <SelectTrigger className="h-7 w-[120px] text-xs bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Linguagem" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-h-[80px] text-sm bg-zinc-950 relative">
        <Editor
          value={element.content || ""}
          onValueChange={(code) => onUpdate?.(element.id, { content: code })}
          highlight={(code) => (
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              PreTag="span"
              CodeTag="span"
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                ...FONT_STYLE,
              }}
              codeTagProps={{
                style: FONT_STYLE,
              }}
            >
              {code}
            </SyntaxHighlighter>
          )}
          padding={16}
          style={{
            ...FONT_STYLE,
            backgroundColor: "transparent",
            color: "transparent",
            caretColor: "#d4d4d4",
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
}
