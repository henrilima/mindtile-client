import type React from "react";

export type ElementType =
  | "title"
  | "subtitle"
  | "text"
  | "separator"
  | "image"
  | "code"
  | "callout"
  | "embed"
  | "poll"
  | "voting"
  | "blockquote"
  | "button"
  | "accordion"
  | "checklist"
  | "timeline"
  | "tabs"
  | "spacer";

export interface CanvasElement {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  content?: string;
}

export interface Block {
  id?: string;
  post_id: string | number;
  position: number;
  type: ElementType;
  content: string;
  props: Record<string, any>;
  created_at?: string;
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  tags?: string[];
  blocks?: Block[];
  likes: number;
  created_at: string;
  date?: string;
  props?: Record<string, any>;
}

export interface Elements {
  id: string;
  label: string;
  type: string;
  icon: React.ElementType;
  style: string;
}
export type ElementCollection = Record<string, Elements>;

export const _baseUrl = "https://mindtile-api.vercel.app/api";
