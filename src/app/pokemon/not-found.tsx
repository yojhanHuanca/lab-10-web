import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center text-white">
      <p className="text-7xl font-bold">404</p>
      <h1 className="text-3xl font-bold">Pokémon no encontrado</h1>
      <p>El Pokémon que buscas no existe en la Pokédex.</p>
      <Link
        href="/pokemon"
        className="mt-2 rounded-lg bg-white px-5 py-3 font-bold text-black transition hover:bg-purple-200"
      >
        Volver al Pokédex
      </Link>
    </main>
  );
}
