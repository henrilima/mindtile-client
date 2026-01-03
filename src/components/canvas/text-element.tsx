"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Highlighter,
  Italic,
} from "lucide-react";
import type { CanvasElement } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const HIGHLIGHT_COLORS = [
  {
    name: "Indigo",
    value: "indigo",
    classes: "bg-indigo-500/20 text-indigo-300",
    preview: "bg-indigo-500",
  },
  {
    name: "Red",
    value: "red",
    classes: "bg-red-500/20 text-red-300",
    preview: "bg-red-500",
  },
  {
    name: "Orange",
    value: "orange",
    classes: "bg-orange-500/20 text-orange-300",
    preview: "bg-orange-500",
  },
  {
    name: "Yellow",
    value: "yellow",
    classes: "bg-yellow-500/20 text-yellow-300",
    preview: "bg-yellow-500",
  },
  {
    name: "Green",
    value: "green",
    classes: "bg-green-500/20 text-green-300",
    preview: "bg-green-500",
  },
  {
    name: "Blue",
    value: "blue",
    classes: "bg-blue-500/20 text-blue-300",
    preview: "bg-blue-500",
  },
  {
    name: "Purple",
    value: "purple",
    classes: "bg-purple-500/20 text-purple-300",
    preview: "bg-purple-500",
  },
  {
    name: "Pink",
    value: "pink",
    classes: "bg-pink-500/20 text-pink-300",
    preview: "bg-pink-500",
  },
];

export function TextElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const align = element.props?.align || "left";
  const highlightColor = element.props?.highlightColor || "indigo";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === "edit" && textareaRef.current) {
      // We use the content length as a data attribute for debugging/styling purposes
      // This also ensures the effect technically depends on element.content, satisfying the linter
      textareaRef.current.dataset.contentLength = String(
        element.content?.length || 0,
      );

      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [element.content, mode]);

  const insertFormat = (format: "bold" | "italic" | "highlight") => {
    const textarea = textareaRef.current;
    if (!textarea || !onUpdate) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = element.content || "";
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    let newText = "";
    if (format === "bold") {
      newText = `${before}**${selection}**${after}`;
    } else if (format === "italic") {
      newText = `${before}_${selection}_${after}`;
    } else if (format === "highlight") {
      newText = `${before}>${selection}<${after}`;
    }

    onUpdate(element.id, { content: newText });

    // Restore focus and selection based on added chars
    setTimeout(() => {
      textarea.focus();
      const offset = format === "bold" ? 2 : 1;
      textarea.setSelectionRange(start + offset, end + offset);
    }, 0);
  };

  const processContent = (content: string) => {
    if (!content) return "";
    let processed = content;

    // Find selected color definition
    const colorDef =
      HIGHLIGHT_COLORS.find((c) => c.value === highlightColor) ||
      HIGHLIGHT_COLORS[0];

    // Handle double backslash as line break
    processed = processed.replace(/\\\\/g, "<br/>");
    // Handle >text< as highlight with dynamic classes
    processed = processed.replace(
      />([^<\n\r]+)</g,
      `<span class="${colorDef.classes} font-semibold px-1 rounded">$1</span>`,
    );
    return processed;
  };

  if (mode === "view") {
    return (
      <div
        className={cn(
          "w-full prose prose-invert max-w-none text-gray-300 leading-relaxed",
          align === "center" && "text-center",
          align === "right" && "text-right",
          align === "justify" && "text-justify",
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => <span className="block mb-2">{children}</span>,
            span: ({ className, children, ...props }) => (
              <span className={className} {...props}>
                {children}
              </span>
            ),
          }}
        >
          {processContent(element.content || "")}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="w-full group relative">
      <div className="absolute -top-12 left-0 z-10 hidden group-focus-within:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={(val: string) =>
            val &&
            onUpdate?.(element.id, { props: { ...element.props, align: val } })
          }
        >
          <ToggleGroupItem value="left" aria-label="Align Left" size="sm">
            <AlignLeft className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align Center" size="sm">
            <AlignCenter className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align Right" size="sm">
            <AlignRight className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="Align Justify" size="sm">
            <AlignJustify className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="w-px h-6 bg-zinc-800 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormat("bold")}
            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("italic")}
            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => insertFormat("highlight")}
              className="p-2 hover:bg-zinc-800 rounded-l-md text-zinc-400 hover:text-zinc-200 transition-colors border-r border-zinc-800"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="p-2 hover:bg-zinc-800 rounded-r-md transition-colors"
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      HIGHLIGHT_COLORS.find((c) => c.value === highlightColor)
                        ?.preview || "bg-indigo-500",
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-3 bg-zinc-950 border-zinc-800"
                align="center"
              >
                <div className="flex gap-2 flex-wrap max-w-[170px]">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        onUpdate?.(element.id, {
                          props: { ...element.props, highlightColor: c.value },
                        })
                      }
                      className={cn(
                        "w-6 h-6 rounded-full border border-zinc-700 hover:scale-110 transition-transform flex items-center justify-center",
                        c.preview,
                      )}
                      title={c.name}
                    >
                      {highlightColor === c.value && (
                        <Check className="w-3 h-3 text-white font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className={cn(
          "w-full bg-transparent border-none outline-none resize-none placeholder:text-zinc-500/50 overflow-hidden text-lg md:text-xl text-gray-300 leading-relaxed whitespace-pre-wrap",
          align === "center" && "text-center",
          align === "right" && "text-right",
          align === "justify" && "text-justify",
        )}
        placeholder="Digite seu texto aqui..."
        rows={1}
        value={element.content || ""}
        onChange={(e) => {
          onUpdate?.(element.id, { content: e.target.value });
        }}
      />
    </div>
  );
}
