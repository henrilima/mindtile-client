import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getPosts } from "@/actions";
import { DialogComponent } from "./admin-client";
import { Plus, Edit, Trash2 } from "lucide-react";

async function action(triggerText: string) {
  const posts = await getPosts(false);

  return (
    <DialogComponent posts={posts} triggerText={triggerText}></DialogComponent>
  );
}

export default async function AdminPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
        <Card className="bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-zinc-700 transition-all group">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <Plus className="w-5 h-5 text-indigo-400" />
            </div>
            <CardTitle className="text-zinc-100">Criar Post</CardTitle>
            <CardDescription className="text-zinc-400">
              Crie um novo post para compartilhar conhecimentos.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/create" className="w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer">
                Criar Novo
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-zinc-700 transition-all group">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <Edit className="w-5 h-5 text-orange-400" />
            </div>
            <CardTitle className="text-zinc-100">Editar Post</CardTitle>
            <CardDescription className="text-zinc-400">
              Selecione e edite um post existente.
            </CardDescription>
          </CardHeader>
          <CardFooter className="w-full">
            <div className="w-full [&>button]:w-full [&>button]:text-amber-500 [&>button]:cursor-pointer">
              {action("Selecionar para Editar")}
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-red-900/30 transition-all group">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <CardTitle className="text-zinc-100">Deletar Post</CardTitle>
            <CardDescription className="text-zinc-400">
              Remova permanentemente um post.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="w-full [&>button]:w-full [&>button]:bg-red-900/20 [&>button]:text-red-400 [&>button]:hover:bg-red-900/40 [&>button]:cursor-pointer">
              {action("Selecionar para Deletar")}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
