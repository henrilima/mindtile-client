import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Sobre o <span className="text-primary">MindTile</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Um espaço digital dedicado a organizar conhecimento e curiosidades.
          </p>
        </header>

        <Card className="border-border/50 bg-card/50 shadow-xl backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Propósito</CardTitle>
            <CardDescription className="leading-relaxed text-muted-foreground text-pretty">
              Este é um projeto desenvolvido com o intuito principal de estudar
              e praticar o ecossistema <strong>Next.js</strong>. O MindTile é um projeto pessoal, nascido da ideia de catalogar curiosidades e torná-las acessíveis a quem se interessar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Tecnologias utilizadas
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  Next.js 15
                </Badge>
                <Badge
                  variant="default"
                  className="bg-sky-500 hover:bg-sky-400"
                >
                  React 19
                </Badge>
                <Badge
                  variant="default"
                  className="bg-teal-500 hover:bg-teal-400"
                >
                  Tailwind CSS 4
                </Badge>
                <Badge
                  variant="default"
                  className="bg-blue-700 hover:bg-blue-600"
                >
                  TypeScript
                </Badge>
                <Badge variant="secondary">Shadcn UI</Badge>
                <Badge variant="outline">Vercel</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
