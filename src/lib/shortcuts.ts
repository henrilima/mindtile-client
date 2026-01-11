import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export type ShortcutAction = (router: AppRouterInstance) => void;

export type ShortcutDetails = {
  action: ShortcutAction;
  description: string;
};

export interface RouteConfig {
  disabled?: boolean;
  [key: string]: ShortcutDetails | boolean | undefined;
}

export interface ShortcutConfig {
  [path: string]: RouteConfig;
}

export const route = (path: string) => (router: AppRouterInstance) => {
  router.push(path);
};

export const back = () => (router: AppRouterInstance) => {
  router.back();
};

export const notify = (message: string) => () => {
  toast.info(message);
};

export const shortcuts: ShortcutConfig = {
  global: {
    "shift+?": {
      action: () => {},
      description: "Mostrar todos os atalhos",
    },
    "ctrl+h": {
      action: route("/"),
      description: "Ir para página inicial",
    },
    "ctrl+b": {
      action: () => {
        window.dispatchEvent(new CustomEvent("toggle-navbar"));
        toast.info("Barra de navegação alternada");
      },
      description: "Esconder/Mostrar a barra de navegação",
    },
  },
  "/": {
    p: {
      action: route("/posts"),
      description: "Ir para a página de posts",
    },
    c: {
      action: route("/covers"),
      description: "Ir para a página de capas",
    },
    "shift+s": {
      action: route("/about"),
      description: "Ir para a página de sobre",
    },
  },
  "/posts": {
    esc: {
      action: route("/"),
      description: "Voltar para Home",
    },
    c: {
      action: route("/covers"),
      description: "Ir para a página de capas",
    },
    "shift+s": {
      action: route("/about"),
      description: "Ir para a página de sobre",
    },
  },
  "/posts/*": {
    p: {
      action: route("/posts"),
      description: "Ir para a página de posts",
    },
    esc: {
      action: route("/posts"),
      description: "Voltar para a lista",
    },
    backspace: {
      action: route("/posts"),
      description: "Voltar",
    },
  },
  "/admin": {
    disabled: true,
  },
  "/admin/*": {
    disabled: true,
  },
};
