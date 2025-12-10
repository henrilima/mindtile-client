import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getPost, type Post } from "@/manager";
import { getBadges } from "@/categories";
import { renderElement, elementsList } from "@/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post: Post = await getPost(id);

  return (
    <div className="w-full min-h-screen flex flex-col items-start justify-start gap-6 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-4 md:py-20">
      <Card className="w-full">
        <CardHeader>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="mb-1 shrink-0 rounded-full"
            >
              <Link href="/posts">
                <ArrowLeft className="size-6" />
              </Link>
            </Button>
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-y-6">
              <h1 className="w-full text-3xl font-extrabold tracking-tight wrap-break-word sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {getBadges(post.tags)}
                </div>
              )}
              <p className="text-sm text-indigo-400/70">
                <span className="font-bold">Atualizado em:</span>{" "}
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-4 w-full px-6">
        {post.blocks && post.blocks.length > 0 ? (
          post.blocks
            .sort((a, b) => a.position - b.position)
            .map((block, index) => (
              <div key={block.id || index}>
                {renderElement(
                  {
                    id: block.id || `view-${index}`,
                    type: block.type,
                    content: block.content,
                    props: block.props || {},
                  },
                  undefined,
                  "view",
                )}
              </div>
            ))
        ) : (
          <p className={elementsList.text.style}>{post.content}</p>
        )}
      </div>
    </div>
  );
}
