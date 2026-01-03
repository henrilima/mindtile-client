import { Card, CardHeader } from "../ui/card";
import { formatDate } from "@/lib/utils";
import { getBadges } from "@/categories";
import type { Post } from "@/types";

export default function CanvasHeader({ post }: { post: Post }) {
  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-y-6">
            <h1 className="w-full text-3xl font-extrabold tracking-tight wrap-break-word sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">{getBadges(post.tags)}</div>
            )}
            <p className="text-sm text-indigo-400/70">
              <span className="font-bold">Atualizado em:</span>{" "}
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
