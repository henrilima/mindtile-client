"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950/50">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 rounded-xl shadow-lg hover:border-red-900/30 transition-all group">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <CardTitle className="text-zinc-100">Algo deu errado</CardTitle>
          <CardDescription className="text-zinc-400">
            {error.message || "Ocorreu um erro inesperado."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-3">
          <Button
            onClick={() => reset()}
            className="w-full bg-red-900/20 text-red-400 hover:bg-red-900/40 border-none cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
