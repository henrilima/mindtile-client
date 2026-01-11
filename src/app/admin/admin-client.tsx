"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deletePost } from "@/actions";
import { toast } from "sonner";

interface Post {
  id: string | number;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
}

interface DialogComponentProps {
  posts: Post[];
  triggerText: string;
}

export function DialogComponent({ posts, triggerText }: DialogComponentProps) {
  const router = useRouter();

  const [selectionOpen, setSelectionOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [disabled, setDisabled] = useState(true);

  function handleSelect(val: string) {
    setDisabled(false);
    setValue(val);
    const selectedPost = posts.find((p) => String(p.id) === val);
    setTitle(selectedPost?.title || "");
  }

  function handleConfirm() {
    const action = triggerText.toLowerCase().includes("editar");

    if (action) {
      router.push(`/admin/edit/${value}`);
      setSelectionOpen(false);
    } else {
      setSelectionOpen(false);
      setOpen(true);
    }
  }

  async function confirmDelete() {
    const response = await deletePost(value);
    setOpen(false);
    if (response) {
      toast.success("Confirmação", {
        description: "O post foi deletado com sucesso.",
      });
      router.refresh();
    } else {
      toast.error("Erro", {
        description: "Ocorreu um erro ao deletar o post.",
      });
    }
  }

  return (
    <>
      <Dialog open={selectionOpen} onOpenChange={setSelectionOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg cursor-pointer"
          >
            {triggerText}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border-zinc-800 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 text-xl font-bold">
              {triggerText} post
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-zinc-400">
              Qual post você deseja {triggerText.toLowerCase()}?
            </p>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 rounded-lg focus:ring-indigo-500/20">
                <SelectValue placeholder="Selecione o post" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300 rounded-xl">
                <SelectGroup>
                  <SelectLabel className="text-zinc-500">Posts</SelectLabel>
                  {posts.map((p) => {
                    return (
                      <SelectItem
                        key={p.id}
                        value={`${p.id}`}
                        className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                      >
                        {p.id} - {p.title}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-4 sm:gap-4 flex-col sm:flex-row">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={disabled}
              onClick={handleConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer"
            >
              Prosseguir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 rounded-2xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100 text-xl font-bold">
              Confirmação de exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 text-base">
              Deseja realmente deletar o post "
              <span className="text-indigo-400 font-semibold">{title}</span>"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setOpen(false)}
              className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border-none cursor-pointer"
            >
              Deletar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
