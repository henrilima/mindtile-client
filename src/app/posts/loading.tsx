"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-xl text-center">
            Estamos carregando tudo...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Spinner className="size-8 text-indigo-500"></Spinner>
        </CardContent>
      </Card>
    </div>
  );
}
