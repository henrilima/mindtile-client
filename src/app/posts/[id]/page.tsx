import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";
import { getPost } from "@/actions";
import { Kbd } from "@/components/ui/kbd";
import { getBadges } from "@/categories";
import { renderElement, elementsList } from "@/utils";

import { LikeButton } from "./like-button";
import { ShareButton } from "@/components/share-button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import type { Metadata } from "next";
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

  if (!post || Array.isArray(post) || ("length" in post && post.length === 0)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20" suppressHydrationWarning>
      <ScrollProgress color={post.props?.progress_color} />
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] flex flex-col justify-end overflow-hidden mb-8 group">
        <div className="absolute inset-0 z-0">
          {post.props?.cover_image ? (
            <Image
              src={post.props.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-linear-to-b from-zinc-900 to-zinc-950 flex items-center justify-center opacity-30`}
            >
              <Image
                src={BrainIcon}
                alt="Placeholder"
                width={120}
                height={120}
                className="opacity-20 blur-sm"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent z-10" />
        </div>

        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all font-medium shadow-sm"
          >
            <Link href="/posts" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              <span>Voltar</span>
              <Kbd>Esc</Kbd>
            </Link>
          </Button>
        </div>

        <div className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {getBadges(post.tags)}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm wrap-break-word">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-zinc-400 font-medium">
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-zinc-600" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span>
                  Leitura est. de {post.props?.reading_time || "5 min"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex items-center justify-between py-4 border-y border-zinc-800/50 mb-8">
          <LikeButton initialLikes={post.likes} postId={String(post.id)} />
          <ShareButton title={post.title} text={post.content?.slice(0, 100)} />
        </div>

        <div className="flex flex-col gap-6 w-full">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks
              .sort((a, b) => a.position - b.position)
              .map((block, index) => (
                <div key={block.id || index} className="w-full">
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
      </article>
    </div>
  );
}
