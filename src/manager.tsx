import type React from "react";

const _baseurl = "https://mindtile-api.vercel.app";

export type ElementType =
  | "title"
  | "subtitle"
  | "text"
  | "separator"
  | "image"
  | "code"
  | "callout"
  | "embed";

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
  created_at: string;
}

export interface Elements {
  id: string;
  label: string;
  type: string;
  icon: React.ElementType;
  style: string;
}
export type ElementCollection = Record<string, Elements>;

export default async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${_baseurl}/api/post`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar dados");
    }

    const data = await res.json();
    return getDataWithTags(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPost(id: string) {
  try {
    const res = await fetch(`${_baseurl}/api/post/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar dados");
    }

    const data = await res.json();
    return getDataWithTags(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deletePost(id: string) {
  try {
    const res = await fetch(`${_baseurl}/api/post/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar post.");
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function saveBlocks(
  postId: string | number,
  blocks: Partial<Block>[],
) {
  try {
    const res = await fetch(`${_baseurl}/api/block/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blocks }),
    });

    if (!res.ok) {
      throw new Error("Erro ao salvar blocos");
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar blocos:", error);
    return false;
  }
}

function getDataWithTags(data: Post | Post[]) {
  // biome-ignore lint/suspicious/noExplicitAny: Ignore
  const processPost = (post: any) => {
    let tags: string[] = [];

    if (Array.isArray(post.tags)) {
      tags = [...post.tags];
    } else if (typeof post.tags === "string") {
      tags = post.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    }

    tags.sort((a, b) => a.localeCompare(b));

    return {
      ...post,
      tags,
    };
  };

  if (Array.isArray(data)) {
    return data.map(processPost);
  }

  return processPost(data);
}
