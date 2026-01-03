"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { managePostLikes } from "@/actions";

interface LikeButtonProps {
  initialLikes: number;
  postId: string;
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const storage = localStorage.getItem(`storage:${postId}:likes`);
    if (storage === "true") {
      setHasLiked(true);
    }
  }, [postId]);

  async function manageLikes() {
    const storage = localStorage.getItem(`storage:${postId}:likes`);

    if (!storage) {
      const success = await managePostLikes(postId, "add");
      if (success) {
        localStorage.setItem(`storage:${postId}:likes`, "true");
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      }
    } else if (storage === "true") {
      const success = await managePostLikes(postId, "remove");
      if (success) {
        localStorage.setItem(`storage:${postId}:likes`, "false");
        setLikes((prev) => prev - 1);
        setHasLiked(false);
      }
    } else {
      const success = await managePostLikes(postId, "add");
      if (success) {
        localStorage.setItem(`storage:${postId}:likes`, "true");
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      }
    }
  }

  return (
    <Button className="cursor-pointer" onClick={manageLikes}>
      <ThumbsUp className="mr-1 h-4 w-4" />
      {likes} curtida{likes === 1 ? "" : "s"} {hasLiked ? "(Você curtiu)" : ""}
    </Button>
  );
}
