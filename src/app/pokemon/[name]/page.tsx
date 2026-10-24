import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Pokemon, PokemonListResponse } from "@/types/pokemon";

interface PokemonPageProps {
  params: Promise<{
    name: string;
  }>;
}

async function getPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
    {
      next: { revalidate: 86400 },
    },
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Error al cargar el Pokémon: ${res.status}`);
  }

  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

  if (!res.ok) {
    throw new Error(`Error al cargar la lista de Pokémon: ${res.status}`);
  }

  const data: PokemonListResponse = await res.json();

  return data.results.map((pokemon) => ({
    name: pokemon.name,
  }));
}

export async function generateMetadata({
  params,
}: PokemonPageProps): Promise<Metadata> {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return {
    title: `${capitalizedName} - Pokédex`,
    description: `Información sobre ${pokemon.name}`,
  };
}

const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-600",
  ghost: "bg-purple-700",
  steel: "bg-gray-500",
};

export default async function PokemonDetail({ params }: PokemonPageProps) {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  const primaryType = pokemon.types[0]?.type.name;
  const headerColor = typeColors[primaryType] ?? "bg-gray-400";
  const artwork = pokemon.sprites.other["official-artwork"].front_default;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className={`bg-linear-to-r from-black ${headerColor} p-8`}>
          <h1 className="text-center text-5xl font-bold capitalize text-white">
            {pokemon.name}
          </h1>
          <p className="mt-2 text-center text-xl text-white">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        </div>
        <div className="p-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-1 items-center justify-center">
              {artwork ? (
                <Image
                  width={150}
                  height={150}
                  src={artwork}
                  alt={pokemon.name}
                  className="h-64 w-64 object-contain"
                />
              ) : (
                <p className="text-gray-500">Imagen no disponible</p>
              )}
            </div>
            <div className="flex-1">
              <section className="mb-6">
                <h2 className="mb-3 text-2xl font-bold text-gray-700">Tipos</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map(({ type }) => (
                    <span
                      key={type.name}
                      className={`${typeColors[type.name] ?? "bg-gray-400"} rounded-full px-4 py-2 font-semibold capitalize text-white`}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </section>
              <section className="mb-6">
                <h2 className="mb-3 text-2xl font-bold text-gray-700">
                  Estadísticas
                </h2>
                {pokemon.stats.map(({ base_stat: baseStat, stat }) => (
                  <div key={stat.name} className="mb-3 text-gray-700">
                    <div className="mb-1 flex justify-between">
                      <span className="font-semibold capitalize">
                        {stat.name.replace("-", " ")}
                      </span>
                      <span className="font-bold">{baseStat}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-linear-to-r from-blue-500 to-purple-600 transition-all"
                        style={{ width: `${(baseStat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </section>
              <section className="text-gray-700">
                <h2 className="mb-3 text-2xl font-bold">Información</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Altura:</strong> {pokemon.height / 10} m
                  </p>
                  <p>
                    <strong>Peso:</strong> {pokemon.weight / 10} kg
                  </p>
                  <p>
                    <strong>Habilidades:</strong>{" "}
                    {pokemon.abilities
                      .map(({ ability }) => ability.name)
                      .join(", ")}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-8">
          <Link
            href="/pokemon"
            className="inline-block rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:bg-purple-900"
          >
            ← Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}
