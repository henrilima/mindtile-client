import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950/50">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-zinc-700 transition-all group">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
            <FileQuestion className="w-5 h-5 text-red-400" />
          </div>
          <CardTitle className="text-zinc-100">Post não encontrado</CardTitle>
          <CardDescription className="text-zinc-400">
            O post que você está tentando acessar não existe ou foi removido.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/posts" className="w-full">
            <Button
              variant="outline"
              className="w-full bg-zinc-900 border-zinc-800 text-red-400 hover:bg-zinc-800 hover:text-red-500 hover:border-zinc-700 cursor-pointer"
            >
              Voltar para os posts
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
