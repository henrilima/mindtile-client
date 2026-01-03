"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ScrollProgress({
  className,
  color = "#6366f1",
}: {
  className?: string;
  color?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        setProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1.5 z-50 bg-transparent",
        className,
      )}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
}
