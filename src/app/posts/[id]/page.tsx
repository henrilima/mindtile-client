import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";
import { getPost } from "@/actions";
import { getBadges } from "@/categories";
import { renderElement, elementsList } from "@/utils";

import { LikeButton } from "./like-button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import type { Metadata } from "next";
import Image from "next/image";
import BrainIcon from "@/images/Brain.png";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post: Post = await getPost(id);

  if (!post || Array.isArray(post)) {
    return {
      title: "Post não encontrado",
      description: "O post que você está procurando não existe.",
    };
  }

  // Use cover image if available, else first image block, else fallback
  const coverImage = post.props?.cover_image;
  const imageBlock = post.blocks?.find((block) => block.type === "image");

  const ogImage = coverImage
    ? [coverImage]
    : imageBlock?.props?.url
      ? [imageBlock.props.url]
      : [BrainIcon.src];

  return {
    title: post.title,
    description: post.content || "Leia este artigo no MindTile",
    openGraph: {
      type: "article",
      title: post.title,
      description: post.content || "Leia este artigo no MindTile",
      url: `https://mindtile.vercel.app/posts/${id}`,
      images: ogImage,
      publishedTime: post.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content || "Leia este artigo no MindTile",
      images: ogImage,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post: Post = await getPost(id);

  return (
    <div className="w-full min-h-screen flex flex-col items-start justify-start gap-6 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-4 md:py-20">
      <ScrollProgress color={post.props?.progress_color} />
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col w-full gap-4">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="mb-1 shrink-0 rounded-full w-10 h-10 self-start"
            >
              <Link href="/posts">
                <ArrowLeft className="size-6" />
              </Link>
            </Button>

            {post.props?.cover_image && (
              <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-2">
                <Image
                  src={post.props.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-y-6 w-full">
                <h1 className="w-full text-3xl font-extrabold tracking-tight wrap-break-word sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {getBadges(post.tags)}
                  </div>
                )}
                <p className="text-sm text-indigo-400/70">
                  <span className="font-bold">Atualizado em: </span>
                  {formatDate(post.created_at)}
                </p>
                <div>
                  <LikeButton
                    initialLikes={post.likes}
                    postId={String(post.id)}
                  />
                </div>
              </div>
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
          <p className={elementsList.text.style}>
            Este post ainda não possui nenhum componente.
          </p>
        )}
      </div>
    </div>
  );
}
