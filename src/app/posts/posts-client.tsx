"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClockArrowDown,
  ClockArrowUp,
  Search,
  Calendar,
  ArrowRight,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBadges, Categories } from "@/categories";
import { formatDate } from "@/lib/utils";
import BrainIcon from "@/images/Brain.png";

interface Post {
  id: string | number;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
  props?: {
    cover_image?: string;
    progress_color?: string;
  };
}

const colorVariants: Record<
  string,
  {
    border: string;
    text: string;
    title: string;
    shadow: string;
  }
> = {
  purple: {
    border: "hover:border-purple-500/50",
    text: "text-purple-400",
    title: "group-hover:text-purple-400",
    shadow: "hover:shadow-purple-500/10",
  },
  yellow: {
    border: "hover:border-yellow-500/50",
    text: "text-yellow-400",
    title: "group-hover:text-yellow-400",
    shadow: "hover:shadow-yellow-500/10",
  },
  red: {
    border: "hover:border-red-500/50",
    text: "text-red-400",
    title: "group-hover:text-red-400",
    shadow: "hover:shadow-red-500/10",
  },
  green: {
    border: "hover:border-green-500/50",
    text: "text-green-400",
    title: "group-hover:text-green-400",
    shadow: "hover:shadow-green-500/10",
  },
  blue: {
    border: "hover:border-blue-500/50",
    text: "text-blue-400",
    title: "group-hover:text-blue-400",
    shadow: "hover:shadow-blue-500/10",
  },
  indigo: {
    border: "hover:border-indigo-500/50",
    text: "text-indigo-400",
    title: "group-hover:text-indigo-400",
    shadow: "hover:shadow-indigo-500/10",
  },
};

export default function Posts({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let sortedPosts = [...posts];

    if (search) {
      sortedPosts = sortedPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter === "newest") {
      return sortedPosts.sort((a, b) => Number(b.id) - Number(a.id));
    }
    if (filter === "oldest") {
      return sortedPosts.sort((a, b) => Number(a.id) - Number(b.id));
    }
    return sortedPosts;
  }, [filter, posts, search]);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 md:py-20 flex flex-col gap-10">
      <div className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <Accordion type="single" collapsible className="w-full border-none">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="text-zinc-100 hover:no-underline hover:text-indigo-400 text-lg font-medium py-2">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filtrar e buscar posts
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:flex-1 space-y-2">
                  <Input
                    type="text"
                    placeholder="Buscar por título..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-zinc-100 h-11 focus:ring-indigo-500/20 rounded-xl"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className={`flex-1 md:flex-none border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 h-11 rounded-xl gap-2 cursor-pointer ${
                      filter === "newest"
                        ? "border-indigo-500/50 text-indigo-400 bg-indigo-500/5"
                        : ""
                    }`}
                    onClick={() => setFilter("newest")}
                  >
                    <ClockArrowUp className="w-4 h-4" /> Mais recentes
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 md:flex-none border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 h-11 rounded-xl gap-2 cursor-pointer ${
                      filter === "oldest"
                        ? "border-indigo-500/50 text-indigo-400 bg-indigo-500/5"
                        : ""
                    }`}
                    onClick={() => setFilter("oldest")}
                  >
                    <ClockArrowDown className="w-4 h-4" /> Mais antigos
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">
              Nenhum post encontrado para os filtros selecionados.
            </p>
          </div>
        )}
        {filtered.map((p: Post, index: number) => {
          const firstColoredTag = p.tags?.find((tag) => Categories[tag]?.color);
          const tagColorClass = firstColoredTag
            ? Categories[firstColoredTag].color
            : "bg-indigo-500";

          const colorName =
            tagColorClass?.replace("bg-", "").replace("-500", "") || "indigo";

          const theme = colorVariants[colorName] || colorVariants.indigo;

          return (
            <Link
              href={`/posts/${p.id}`}
              key={p.id}
              className={`group relative flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden ${theme.border} hover:shadow-2xl ${theme.shadow} hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              suppressHydrationWarning
            >
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-950">
                {p.props?.cover_image ? (
                  <Image
                    src={p.props.cover_image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <Image
                      src={BrainIcon}
                      alt="Placeholder"
                      width={100}
                      height={100}
                      className="opacity-75 transition-all duration-500"
                    />
                    <div className="absolute inset-0" />
                  </div>
                )}
                {p.tags && p.tags.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
                    {getBadges(p.tags)}
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6 gap-4">
                <div
                  className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider"
                  suppressHydrationWarning
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(p.created_at)}
                </div>

                <h2
                  className={`text-xl font-bold text-zinc-100 leading-tight line-clamp-2 ${theme.title} transition-colors`}
                >
                  {p.title}
                </h2>

                <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed flex-1">
                  {p.content}
                </p>

                <div
                  className={`pt-4 mt-auto flex items-center text-sm font-medium ${theme.text} group-hover:translate-x-1 transition-transform`}
                >
                  Ler artigo completo <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
