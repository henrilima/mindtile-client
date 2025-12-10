import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Página não encontrada</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            A página que você tentou acessar não existe.
          </p>
        </CardContent>

        <CardFooter>
          <Button className="w-full" asChild>
            <a href="/">Voltar para o início</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
