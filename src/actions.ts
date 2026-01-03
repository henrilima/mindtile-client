"use server";
import { _baseUrl, type Block, type Post } from "./types";

export async function createPost(data: {
  title: string;
  content: string;
  theme: string;
}) {
  try {
    const res = await fetch(`${_baseUrl}/post/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Erro ao criar post");
    }

    return true;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return false;
  }
}

export async function deletePost(id: string) {
  try {
    const res = await fetch(`${_baseUrl}/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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

function getDataWithTags(data: Post | Post[]) {
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

    let props = post.props;
    try {
      if (typeof props === "string") {
        props = JSON.parse(props);
      }
    } catch (error) {
      console.error("Erro ao fazer parse das props:", error);
      props = {};
    }

    return {
      ...post,
      tags,
      props,
    };
  };

  if (Array.isArray(data)) {
    return data.map(processPost);
  }

  return processPost(data);
}

export async function getPost(id: string) {
  try {
    const res = await fetch(`${_baseUrl}/post/${id}`, {
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

export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${_baseUrl}/post`, {
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

export async function managePostLikes(
  id: string,
  action: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${_baseUrl}/post/${id}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: action }),
    });

    const response = await res.json();
    console.log(response.message);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function saveBlocks(
  postId: string | number,
  blocks: Partial<Block>[],
) {
  try {
    const res = await fetch(`${_baseUrl}/block/${postId}`, {
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

export async function updatePost(
  id: string,
  data: {
    title: string;
    content: string;
    tags: string[];
    props?: Record<string, any>;
  },
) {
  try {
    const res = await fetch(`${_baseUrl}/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        tags: data.tags.join(","),
        props: data.props ? JSON.stringify(data.props) : undefined,
      }),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar post");
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return false;
  }
}
