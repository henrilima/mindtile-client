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
    const action = triggerText.toLowerCase() === "editar";

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
          <Button variant="outline">{triggerText}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{triggerText} post</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <p>Qual post você deseja {triggerText.toLowerCase()}?</p>
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o post" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Posts</SelectLabel>
                  {posts.map((p) => {
                    return (
                      <SelectItem key={p.id} value={`${p.id}`}>
                        {p.id} - {p.title}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button disabled={disabled} onClick={handleConfirm}>
              Prosseguir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja mesmo deletar "
              <span className="text-indigo-400 font-bold">{title}</span>"?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete()}
              className="bg-red-800 text-zinc-50"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
