"use client";

import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Link copiado!", {
      description: "O link do post foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? "Copiado!" : "Copiar Link"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share2 className="w-4 h-4 mr-2" />
          Outras opções...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
