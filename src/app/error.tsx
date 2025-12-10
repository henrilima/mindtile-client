"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Erro inesperado</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error.message || "Algo deu errado."}
          </p>
        </CardContent>

        <CardFooter>
          <Button onClick={() => reset()} className="w-full">
            Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}