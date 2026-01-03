import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Brain from "@/images/Brain.png";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 max-md:flex-col">
      <Image src={Brain} alt="MindTile Brain" className="max-w-[340px]" draggable="false" />
      <div className="max-md:flex flex-col justify-center items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-amber-500 max-md:text-center">
          MindTile
        </h1>
        <p className="text-xl text-gray-300 max-w-prose mx-auto leading-relaxed max-md:text-center">
          Meu espaço pessoal de curadoria e aprendizado. Aqui registro o que
          acho interessante, criando um mosaico do meu conhecimento.
        </p>
        <Link href="/posts">
          <Button className="mt-8 px-8 py-3 text-md font-semibold shadow-md cursor-pointer">
            Explorar
          </Button>
        </Link>
      </div>
    </div>
  );
}
