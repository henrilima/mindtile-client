"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  Info,
  Check,
} from "lucide-react";
import type { CanvasElement } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Editor from "react-simple-code-editor";
import { useState, useRef } from "react";

import { ELEMENT_COLORS } from "@/colors";

const HIGHLIGHT_COLORS = ELEMENT_COLORS.map((color) => ({
  name: color.name,
  value: color.name.toLowerCase(),
  classes: color.text,
  preview: color.tailwind,
}));

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

  const [activePopover, setActivePopover] = useState<
    "link" | "tooltip" | "color" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const saveSelection = () => {
    const textarea = document.querySelector(
      `textarea[id="editor-${element.id}"]`,
    ) as HTMLTextAreaElement;
    if (textarea) {
      selectionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };
    }
  };

  const handleInsert = (type: "link" | "tooltip", value: string) => {
    if (!onUpdate || !selectionRef.current) return;

    const { start, end } = selectionRef.current;
    const text = element.content || "";
    const before = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const after = text.substring(end);
    let newText = "";

    if (type === "link") {
      newText = `${before}[${selectedText || "link"}](${value})${after}`;
    } else if (type === "tooltip") {
      newText = `${before}[${selectedText || "texto"}]?(${value})${after}`;
    }

    onUpdate(element.id, { content: newText });
    setActivePopover(null);
    setInputValue("");

    setTimeout(() => {
      const textarea = document.querySelector(
        `textarea[id="editor-${element.id}"]`,
      ) as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }, 0);
  };

  const insertFormat = (
    format: "bold" | "italic" | "color",
    value?: string,
  ) => {
    if (!onUpdate) return;

    const textarea = document.querySelector(
      `textarea[id="editor-${element.id}"]`,
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = element.content || "";
    const before = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const after = text.substring(end);

    let newText = "";

    if (format === "bold") {
      newText = `${before}**${selectedText}**${after}`;
    } else if (format === "italic") {
      newText = `${before}_${selectedText}_${after}`;
    } else if (format === "color" && value) {
      newText = `${before}[${selectedText}]{${value}}${after}`;
    }

    if (newText) {
      onUpdate(element.id, { content: newText });
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  const highlightContent = (code: string) => {
    // Basic HTML escaping
    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold: **text**
    highlighted = highlighted.replace(
      /(\*\*|__)(.*?)\1/g,
      '<span class="text-zinc-500 font-normal">$1</span><strong class="text-gray-100">$2</strong><span class="text-zinc-500 font-normal">$1</span>',
    );

    // Italic: _text_
    highlighted = highlighted.replace(
      /(\*|_)(.*?)\1/g,
      '<span class="text-zinc-500 font-normal">$1</span><em class="text-gray-100">$2</em><span class="text-zinc-500 font-normal">$1</span>',
    );

    // Tooltips: [text]?(tip)
    highlighted = highlighted.replace(
      /\[(.*?)\]\?\((.*?)\)/g,
      '<span class="text-zinc-500">[</span><span class="underline decoration-dotted decoration-zinc-500 underline-offset-4 text-gray-100" title="$2">$1</span><span class="text-zinc-500">]?($2)</span>',
    );

    // Links: [text](url)
    highlighted = highlighted.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<span class="text-zinc-500">[</span><span class="text-blue-400 underline">$1</span><span class="text-zinc-500">]($2)</span>',
    );

    // Colors: [text]{color}
    HIGHLIGHT_COLORS.forEach((color) => {
      // Escape for regex
      const regex = new RegExp(`\\[(.*?)\\]\\{${color.value}\\}`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span class="text-zinc-500">[</span><span class="${color.classes}">$1</span><span class="text-zinc-500">]{${color.value}}</span>`,
      );
    });

    return highlighted;
  };

  const processContent = (content: string) => {
    if (!content) return "";
    let processed = content;

    processed = processed.replace(/\\\\/g, "  \n");

    // Transform Custom Syntax to Markdown Links

    // Tooltips: [text]?(tip) -> [text](tooltip:tipEncoded)
    processed = processed.replace(
      /\[(.*?)\]\?\((.*?)\)/g,
      (match, text, tip) => `[${text}](tooltip:${encodeURIComponent(tip)})`,
    );

    // Colors: [text]{color} -> [text](color:blue)
    HIGHLIGHT_COLORS.forEach((color) => {
      const regex = new RegExp(`\\[(.*?)\\]\\{${color.value}\\}`, "g");
      processed = processed.replace(regex, `[$1](color:${color.value})`);
    });

    return processed;
  };

  if (mode === "view") {
    return (
      <div
        className={cn(
          "w-full prose prose-invert max-w-none text-gray-300 leading-relaxed break-words",
          align === "center" && "text-center",
          align === "right" && "text-right",
          align === "justify" && "text-justify",
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          urlTransform={(url) => url}
          components={{
            p: ({ children }) => <span className="block mb-2">{children}</span>,
            a: ({ href, children, ...props }) => {
              if (!href) return <a {...props}>{children}</a>;

              // Handle Tooltips
              if (href.startsWith("tooltip:")) {
                const tooltipText = decodeURIComponent(href.slice(8));
                return (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <span
                          className={cn(
                            "underline decoration-dotted decoration-zinc-500 underline-offset-4 cursor-help inline-block",
                            props.className,
                          )}
                        >
                          {children}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              // Handle Colors
              if (href.startsWith("color:")) {
                const colorValue = href.slice(6);
                const colorDef =
                  HIGHLIGHT_COLORS.find((c) => c.value === colorValue) ||
                  HIGHLIGHT_COLORS[0];
                return (
                  <span
                    className={cn(
                      "font-medium",
                      colorDef.classes,
                      props.className,
                    )}
                  >
                    {children}
                  </span>
                );
              }

              // Normal Links
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline cursor-pointer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {processContent(element.content || "")}
        </ReactMarkdown>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="w-full group relative">
      <div className="absolute -top-12 left-0 z-50 flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
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
            title="Negrito (**texto**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("italic")}
            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Itálico (_texto_)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <Popover
            open={activePopover === "link"}
            onOpenChange={(open) => {
              if (open) saveSelection();
              setActivePopover(open ? "link" : null);
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Link [texto](url)"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 bg-zinc-950 border-zinc-800">
              <div className="space-y-2">
                <Label
                  htmlFor="link-url"
                  className="text-xs font-semibold text-zinc-400"
                >
                  URL do Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="link-url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-900 border-zinc-800 h-8 text-sm"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleInsert("link", inputValue)
                    }
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleInsert("link", inputValue)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover
            open={activePopover === "tooltip"}
            onOpenChange={(open) => {
              if (open) saveSelection();
              setActivePopover(open ? "tooltip" : null);
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Dica [texto]?(dica)"
              >
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 bg-zinc-950 border-zinc-800">
              <div className="space-y-2">
                <Label
                  htmlFor="tooltip-text"
                  className="text-xs font-semibold text-zinc-400"
                >
                  Texto da Dica
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tooltip-text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite a dica..."
                    className="bg-zinc-900 border-zinc-800 h-8 text-sm"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleInsert("tooltip", inputValue)
                    }
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleInsert("tooltip", inputValue)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                title="Cor do Texto"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
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
                    onClick={() => insertFormat("color", c.value)}
                    className={cn(
                      "w-6 h-6 rounded-full border border-zinc-700 hover:scale-110 transition-transform flex items-center justify-center",
                      c.preview,
                    )}
                    title={c.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="editor-container w-full min-h-[1.5em] text-lg md:text-xl leading-relaxed">
        <Editor
          value={element.content || ""}
          onValueChange={(code) => onUpdate?.(element.id, { content: code })}
          highlight={highlightContent}
          padding={0}
          textareaId={`editor-${element.id}`}
          className={cn(
            "min-h-[1.5em] font-sans",
            // We rely on the style prop for base color to ensure it cascades correctly
            align === "center" && "text-center",
            align === "right" && "text-right",
            align === "justify" && "text-justify",
          )}
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            minHeight: "1.5em",
            color: "#f4f4f5", // zinc-100 base color
          }}
          textareaClassName="focus:outline-none bg-transparent placeholder:text-zinc-600 caret-white"
          placeholder="Digite seu texto aqui..."
        />
      </div>
    </div>
  );
}
