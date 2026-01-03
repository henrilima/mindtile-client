import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

export const Categories: Record<
  string,
  { label: string; color?: string; isDark?: boolean; priority?: boolean }
> = Object.freeze({
  religioes: { label: "Religiões" },
  cultura: { label: "Cultura" },
  medicina: { label: "Medicina" },
  zoologia: { label: "Zoologia" },
  astronomia: { label: "Astronomia" },
  linguistica: { label: "Linguística" },
  comunicacao: { label: "Comunicação" },
  tecnologia: { label: "Tecnologia" },
  cotidiano: { label: "Cotidiano" },
  imperios: { label: "Impérios" },
  mitos: { label: "Mitos" },
  simbolismo: { label: "Simbolismo" },
  literatura: { label: "Literatura" },
  psicologia: { label: "Psicologia" },
  economia: { label: "Economia" },
  direito: { label: "Direito" },
  engenharia: { label: "Engenharia" },

  ciencias: { label: "Ciências", color: "bg-green-500", priority: true },
  historia: { label: "História", color: "bg-yellow-500", priority: true },
  biologia: { label: "Biologia", color: "bg-emerald-500", priority: true },
  portugues: { label: "Português", color: "bg-red-500", priority: true },
  matematica: { label: "Matemática", color: "bg-blue-500", priority: true },
  fisica: { label: "Física", color: "bg-indigo-500", priority: true },
  quimica: { label: "Química", color: "bg-purple-500", priority: true },
  geografia: { label: "Geografia", color: "bg-amber-500", priority: true },
  filosofia: { label: "Filosofia", color: "bg-slate-500", priority: true },
  sociologia: { label: "Sociologia", color: "bg-stone-500", priority: true },
  artes: { label: "Artes", color: "bg-fuchsia-500", priority: true },
});

export const getBadges = (tags: string | string[]) => {
  let tagList = Array.isArray(tags)
    ? [...tags]
    : tags.split(",").map((tag) => tag.trim());

  tagList = tagList.sort((a, b) => {
    const priorityA = Categories[a]?.priority ? 1 : 0;
    const priorityB = Categories[b]?.priority ? 1 : 0;
    return priorityB - priorityA;
  });

  return tagList.map((tag: string) => {
    const category = Categories[tag];

    return (
      <Badge
        key={tag}
        variant="secondary"
        className={cn(
          category?.color || "bg-stone-700",
          category?.color && !category?.isDark ? "text-gray-950" : "text-white",
        )}
      >
        {category?.label || tag}
      </Badge>
    );
  });
};
