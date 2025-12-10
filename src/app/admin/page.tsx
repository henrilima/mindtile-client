import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import getPosts from "@/manager";
import { DialogComponent } from "./admin-client";

async function action(triggerText: string) {
  const posts = await getPosts();

  return (
    <DialogComponent
      posts={posts}
      triggerText={triggerText}
    ></DialogComponent>
  );
}

export default async function AdminPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8 md:py-20">
      <Item variant="muted" className="min-w-xl max-w-xl">
        <ItemContent>
          <ItemTitle className="text-lg">Criar post</ItemTitle>
          <ItemDescription>
            Crie um novo post para compartilhar a nova curiosidade com o mundo.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Link href="/admin/create">
            <Button variant="outline" size="sm">
              Criar
            </Button>
          </Link>
        </ItemActions>
      </Item>
      <Item variant="muted" className="min-w-xl max-w-xl">
        <ItemContent>
          <ItemTitle className="text-lg">Editar post</ItemTitle>
          <ItemDescription>
            Selecione um post existente para editar.
          </ItemDescription>
        </ItemContent>
        <ItemActions>{action("Editar")}</ItemActions>
      </Item>
      <Item variant="muted" className="min-w-xl max-w-xl bg-red-500">
        <ItemContent>
          <ItemTitle className="text-zinc-950 text-lg">Deletar post</ItemTitle>
          <ItemDescription className="text-zinc-900">
            Selecione um post existente para deletá-lo.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ItemActions>{action("Deletar")}</ItemActions>
        </ItemActions>
      </Item>
    </div>
  );
}
