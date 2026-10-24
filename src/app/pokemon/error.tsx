"use client";

import Link from "next/link";
import { useEffect } from "react";

interface PokemonErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function PokemonError({ error, retry }: PokemonErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center text-white">
      <h1 className="text-4xl font-bold">Algo salió mal</h1>
      <p>No se pudo cargar la información del Pokémon.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="rounded-lg bg-white px-5 py-3 font-bold text-black transition hover:bg-purple-200"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/pokemon"
          className="rounded-lg border border-white px-5 py-3 font-bold text-white transition hover:bg-white hover:text-black"
        >
          Volver al Pokédex
        </Link>
      </div>
    </main>
  );
}