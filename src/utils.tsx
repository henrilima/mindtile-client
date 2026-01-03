import {
  Code,
  Globe,
  Heading1,
  Heading2,
  Image,
  Lightbulb,
  ListChecks,
  SquareSplitVertical,
  Type,
} from "lucide-react";
import { Separator } from "./components/ui/separator";
import type { CanvasElement, ElementCollection } from "./types";
import { ImageElement } from "./components/canvas/image-element";
import { CodeElement } from "./components/canvas/code-element";
import { CalloutElement } from "./components/canvas/callout-element";
import { EmbedElement } from "./components/canvas/embed-element";
import { TextElement } from "./components/canvas/text-element";
import { TitleElement } from "./components/canvas/title-element";
import { PollElement } from "./components/canvas/poll-element";

export const elementsList: ElementCollection = {
  title: {
    id: "title",
    label: "Título",
    type: "title",
    icon: Heading1,
    style: "",
  },
  subtitle: {
    id: "subtitle",
    label: "Subtítulo",
    type: "subtitle",
    icon: Heading2,
    style: "",
  },
  text: {
    id: "text",
    label: "Texto",
    type: "text",
    icon: Type,
    style: "",
  },
  image: {
    id: "image",
    label: "Imagem",
    type: "image",
    icon: Image,
    style: "",
  },
  poll: {
    id: "poll",
    label: "Enquete",
    type: "poll",
    icon: ListChecks,
    style: "",
  },
  code: {
    id: "code",
    label: "Código",
    type: "code",
    icon: Code,
    style: "",
  },
  callout: {
    id: "callout",
    label: "Ideia",
    type: "callout",
    icon: Lightbulb,
    style: "",
  },
  embed: {
    id: "embed",
    label: "Embed",
    type: "embed",
    icon: Globe,
    style: "",
  },
  separator: {
    id: "separator",
    label: "Divisor",
    type: "separator",
    icon: SquareSplitVertical,
    style: "mt-2 mb-4",
  },
};

export function renderElement(
  el: CanvasElement,
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void,
  mode: "edit" | "view" = "edit",
) {
  if (mode === "view") {
    switch (el.type) {
      case "title":
        return <TitleElement element={el} mode="view" type="title" />;
      case "subtitle":
        return <TitleElement element={el} mode="view" type="subtitle" />;
      case "text":
        return <TextElement element={el} mode="view" />;
      case "image":
        if (!el.content) return null;
        return <ImageElement element={el} />;
      case "poll":
        if (!el.content || !el.props?.options || el.props.options.length < 2)
          return null;
        return <PollElement element={el} mode="view" />;
      case "code":
        if (!el.content) return null;
        return <CodeElement element={el} mode="view" />;
      case "callout":
        return <CalloutElement element={el} mode="view" />;
      case "embed":
        if (!el.content) return null;
        return <EmbedElement element={el} mode="view" />;
      case "separator":
        return <Separator className={elementsList.separator.style} />;
      default:
        return null;
    }
  }

  switch (el.type) {
    case "title":
      return (
        <TitleElement
          element={el}
          onUpdate={onUpdate}
          mode="edit"
          type="title"
        />
      );
    case "subtitle":
      return (
        <TitleElement
          element={el}
          onUpdate={onUpdate}
          mode="edit"
          type="subtitle"
        />
      );
    case "text":
      return <TextElement element={el} onUpdate={onUpdate} mode="edit" />;
    case "image":
      return <ImageElement element={el} onUpdate={onUpdate} />;
    case "poll":
      return <PollElement element={el} onUpdate={onUpdate} mode="edit" />;
    case "code":
      return <CodeElement element={el} onUpdate={onUpdate} mode="edit" />;
    case "callout":
      return <CalloutElement element={el} onUpdate={onUpdate} mode="edit" />;
    case "embed":
      return <EmbedElement element={el} onUpdate={onUpdate} mode="edit" />;
    case "separator":
      return <Separator className={elementsList.separator.style} />;
    default:
      return null;
  }
}
