"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions";

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const getLocalISOString = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    theme: "",
    date: getLocalISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const result = await createPost(formData);

      if (result) {
        setStatus("success");
        const postId =
          typeof result === "object" || result !== true ? result : null;

        setTimeout(() => {
          if (postId) {
            router.push(`/admin/edit/${postId}`);
          } else {
            router.push("/admin");
          }
          router.refresh();
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage("Erro ao criar post. Verifique o console.");
        console.error("Erro ao criar post");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      setStatus("error");
      setErrorMessage("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-zinc-950/50">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-6 rounded-2xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-zinc-100">Criar Novo Post</h1>
        </div>

        {status === "success" && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Post criado com sucesso. Redirecionando...
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert
            variant="destructive"
            className="bg-red-900/10 border-red-900/20"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-zinc-400"
            >
              Título
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Digite o título principal..."
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-zinc-900 text-zinc-100 border-zinc-800 focus:ring-indigo-500/20 rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-zinc-400">
              Data e Hora de Publicação
            </label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-zinc-900 text-zinc-100 border-zinc-800 focus:ring-indigo-500/20 rounded-xl h-12 calendar-dark"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-zinc-400"
            >
              Conteúdo / Resumo
            </label>
            <Textarea
              id="content"
              name="content"
              rows={5}
              placeholder="Escreva um breve resumo do post..."
              value={formData.content}
              onChange={handleChange}
              required
              className="bg-zinc-900 text-zinc-100 border-zinc-800 focus:ring-indigo-500/20 rounded-xl resize-none p-4"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="theme"
              className="text-sm font-medium text-zinc-400"
            >
              Tema / Categoria Inicial
            </label>
            <Input
              id="theme"
              name="theme"
              placeholder="Ex: Curiosidade, Tecnologia..."
              value={formData.theme}
              onChange={handleChange}
              required
              className="bg-zinc-900 text-zinc-100 border-zinc-800 focus:ring-indigo-500/20 rounded-xl h-12"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800 mt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl h-12 cursor-pointer"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl h-12 shadow-lg shadow-indigo-500/20 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? "Criando..." : "Criar Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
