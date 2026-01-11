"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950/50">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-zinc-700 transition-all group">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
          <CardTitle className="text-zinc-100">Carregando</CardTitle>
          <CardDescription className="text-zinc-400">
            Estamos preparando o conteúdo para você.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            disabled
            className="w-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-medium cursor-not-allowed"
          >
            Aguarde...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
