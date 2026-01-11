import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

export const Categories: Record<
  string,
  { label: string; color?: string; isDark?: boolean; priority?: boolean }
> = Object.freeze({
  astronomia: { label: "Astronomia", color: "bg-purple-500", priority: true },
  historia: { label: "História", color: "bg-yellow-500", priority: true },
  artes: { label: "Artes", color: "bg-red-500", priority: true },
  biologia: { label: "Biologia", color: "bg-green-500", priority: true },
  ciencias: { label: "Ciências", color: "bg-blue-500", priority: true },

  extra: { label: "EXTRA", priority: true },

  religioes: { label: "Religiões" },
  cultura: { label: "Cultura" },
  medicina: { label: "Medicina" },
  zoologia: { label: "Zoologia" },
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
  portugues: { label: "Português" },
  matematica: { label: "Matemática" },
  fisica: { label: "Física" },
  quimica: { label: "Química" },
  geografia: { label: "Geografia" },
  filosofia: { label: "Filosofia" },
  sociologia: { label: "Sociologia" },
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
