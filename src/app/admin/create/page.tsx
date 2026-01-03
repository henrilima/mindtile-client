"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions";

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    theme: "",
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
      const success = await createPost(formData);

      if (success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 2000);
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
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-zinc-900 p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white">Criar Post</h1>

        {status === "success" && (
          <Alert className="bg-green-500 text-zinc-950">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription className="text-zinc-800">
              Post criado com sucesso. Redirecionando...
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-zinc-200">
            Título
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Digite o título..."
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-zinc-800 text-white border-zinc-700 focus:border-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="content"
            className="text-sm font-medium text-zinc-200"
          >
            Conteúdo
          </label>
          <Textarea
            id="content"
            name="content"
            rows={5}
            placeholder="Escreva o conteúdo do post..."
            value={formData.content}
            onChange={handleChange}
            required
            className="bg-zinc-800 text-white border-zinc-700 focus:border-white resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="theme" className="text-sm font-medium text-zinc-200">
            Tema
          </label>
          <Input
            id="theme"
            name="theme"
            placeholder="Ex: Curiosidade, Tecnologia..."
            value={formData.theme}
            onChange={handleChange}
            required
            className="bg-zinc-800 text-white border-zinc-700 focus:border-white"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-white text-black hover:bg-zinc-200"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
