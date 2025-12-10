import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

const Categories: Record<
  string,
  { label: string; color: string; isDark?: boolean }
> = Object.freeze({
  historia: { label: "História", color: "bg-yellow-500" },
  religioes: { label: "Religiões", color: "bg-red-600" },
  cultura: { label: "Cultura", color: "bg-orange-500" },
  medicina: { label: "Medicina", color: "bg-rose-500" },
  biologia: { label: "Biologia", color: "bg-emerald-500" },
  zoologia: { label: "Zoologia", color: "bg-green-600" },
  astronomia: { label: "Astronomia", color: "bg-cyan-500" },
  linguistica: { label: "Linguística", color: "bg-indigo-400" },
  comunicacao: { label: "Comunicação", color: "bg-blue-400" },
  ciencias: { label: "Ciências", color: "bg-green-500" },
  tecnologia: { label: "Tecnologia", color: "bg-violet-500" },
  cotidiano: { label: "Cotidiano", color: "bg-amber-500" },
  imperios: { label: "Impérios", color: "bg-stone-600" },
  mitos: { label: "Mitos", color: "bg-purple-600" },
  simbolismo: { label: "Simbolismo", color: "bg-fuchsia-500" },
  mundomoderno: { label: "Mundo Moderno", color: "bg-sky-600" },

  portugues: { label: "Português", color: "bg-red-500" },
  matematica: { label: "Matemática", color: "bg-blue-500" },
  fisica: { label: "Física", color: "bg-indigo-500" },
  quimica: { label: "Química", color: "bg-purple-500" },
  geografia: { label: "Geografia", color: "bg-amber-500" },
  filosofia: { label: "Filosofia", color: "bg-slate-500" },
  sociologia: { label: "Sociologia", color: "bg-stone-500" },
  literatura: { label: "Literatura", color: "bg-orange-500" },
  psicologia: { label: "Psicologia", color: "bg-pink-500" },
  economia: { label: "Economia", color: "bg-lime-500" },
  direito: { label: "Direito", color: "bg-gray-600" },
  engenharia: { label: "Engenharia", color: "bg-sky-500" },
  artes: { label: "Artes", color: "bg-fuchsia-500" },
});

export const getBadges = (tags: string | string[]) => {
  const tagList = Array.isArray(tags)
    ? tags
    : tags.split(",").map((tag) => tag.trim());

  return tagList.map((tag: string) => {
    const category = Categories[tag];

    return (
      <Badge
        key={tag}
        variant="secondary"
        className={cn(
          category?.color,
          category?.isDark ? "text-white" : "text-gray-950",
        )}
      >
        {category?.label || tag}
      </Badge>
    );
  });
};
