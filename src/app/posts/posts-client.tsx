"use client";

// biome-ignore assist/source/organizeImports: Ignore
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBadges } from "@/categories";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string | number;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
}

export default function Posts({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let sortedPosts = [...posts];

    if (search) {
      sortedPosts = sortedPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter === "newest") {
      return sortedPosts.sort((a, b) => {
        const d1 = new Date(a.created_at);
        const d2 = new Date(b.created_at);
        return d2.getTime() - d1.getTime();
      });
    }
    if (filter === "oldest") {
      return sortedPosts.sort((a, b) => {
        const d1 = new Date(a.created_at);
        const d2 = new Date(b.created_at);
        return d1.getTime() - d2.getTime();
      });
    }
    return sortedPosts;
  }, [filter, posts, search]);

  return (
    <div className="w-full min-h-screen max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 md:py-20 flex flex-col gap-6">
      <Card className="w-full">
        <CardContent className="flex flex-wrap items-end justify-start">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="i1">
              <AccordionTrigger>Filtros</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                <Input
                  type="text"
                  id="title"
                  placeholder="Busque o conteúdo pelo título"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setFilter("newest")}
                  >
                    <ClockArrowUp /> Mais recentes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setFilter("oldest")}
                  >
                    <ClockArrowDown /> Mais antigos
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start justify-items-center sm:justify-items-stretch">
        {filtered.map((p: Post) => (
          <Card key={p.id} className="w-full min-h-[250px] overflow-hidden">
            <CardHeader className="flex flex-col gap-2 items-start">
              <CardTitle className="text-xl font-bold line-clamp-2 overflow-hidden">
                {p.title}
              </CardTitle>
              <p className="text-sm text-indigo-600">
                <span>Atualizado em:</span> {formatDate(p.created_at)}
              </p>
              {p.tags && p.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">{getBadges(p.tags)}</div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 line-clamp-3 overflow-hidden">
                {p.content}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/posts/${p.id}`}>
                <Button className="cursor-pointer">Mostrar mais</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
