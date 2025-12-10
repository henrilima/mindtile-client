import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-amber-500">
          MindTile
        </h1>
        <p className="text-xl text-gray-300 max-w-prose mx-auto leading-relaxed">
          Desvende novos horizontes do conhecimento. Cada semana, uma nova
          curiosidade para inspirar sua jornada de aprendizado.
        </p>
        <Link href="/posts">
          <Button
            size="lg"
            className="mt-8 px-8 py-3 text-lg font-semibold rounded-full shadow-md cursor-pointer"
          >
            Começar a Aprender
          </Button>
        </Link>
      </div>
    </div>
  );
}
