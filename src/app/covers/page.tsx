import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import ArtesCover from "@/images/posts/artes.png";
import AstronomiaCover from "@/images/posts/astronomia.png";
import BiologiaCover from "@/images/posts/biologia.png";
import HistoriaCover from "@/images/posts/historia.png";

const covers = [
  { name: "Artes", image: ArtesCover, filename: "artes.png" },
  { name: "Astronomia", image: AstronomiaCover, filename: "astronomia.png" },
  { name: "Biologia", image: BiologiaCover, filename: "biologia.png" },
  { name: "História", image: HistoriaCover, filename: "historia.png" },
];

export default function CoversPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">
          Capas para Stories
        </h1>
        <p className="text-zinc-400">
          Galeria de capas disponíveis para divulgação.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {covers.map((cover) => (
          <div
            key={cover.name}
            className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700 hover:ring-2 hover:ring-indigo-500/20"
          >
            <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
              <Image
                src={cover.image}
                alt={`Capa ${cover.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-10">
                <a
                  href={cover.image.src}
                  download={cover.filename}
                  className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full font-semibold gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    Baixar
                  </Button>
                </a>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 relative z-20">
              <h3 className="font-semibold text-zinc-200 text-center">
                {cover.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
