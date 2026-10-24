"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoFilter,
  IoLocationOutline,
  IoPlanet,
  IoSearch,
  IoSparkles,
  IoTvOutline,
} from "react-icons/io5";
import type { Character, RickAndMortyApiResponse } from "@/types/rickandmorty";

type CharacterFilters = {
  name: string;
  status: string;
  gender: string;
  type: string;
};

const initialFilters: CharacterFilters = {
  name: "",
  status: "",
  gender: "",
  type: "",
};

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "alive":
      return {
        dot: "bg-emerald-400",
        label: "text-emerald-200",
        pulse: true,
      };
    case "dead":
      return {
        dot: "bg-red-500 shadow-[0_0_12px_#ef4444]",
        label: "text-red-200",
        pulse: false,
      };
    default:
      return {
        dot: "bg-slate-400",
        label: "text-slate-300",
        pulse: false,
      };
  }
}

function CharacterCard({ character }: { character: Character }) {
  const status = statusStyle(character.status);

  return (
    <Link
      href={`/rickandmorty/${character.id}`}
      className="portal-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      aria-label={`Ver expediente de ${character.name}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <Image
          src={character.image}
          alt={`Retrato de ${character.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${status.label}`}
        >
          <span className="relative flex size-2">
            {status.pulse && (
              <span
                className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            <span
              className={`relative inline-flex size-2 rounded-full ${status.dot}`}
              aria-hidden="true"
            />
          </span>
          {character.status}
        </span>
        <span className="absolute bottom-3 left-4 right-4">
          <span className="block text-xl font-bold text-white drop-shadow-lg">
            {character.name}
          </span>
          <span className="mt-1 block text-xs text-slate-300">
            Expediente #{String(character.id).padStart(3, "0")}
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Especie
            </p>
            <p className="mt-1 truncate text-sm text-slate-200">
              {character.species}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Género
            </p>
            <p className="mt-1 truncate text-sm text-slate-200">
              {character.gender}
            </p>
          </div>
        </div>
        <p className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <IoLocationOutline
            className="shrink-0 text-emerald-300"
            aria-hidden="true"
          />
          <span className="truncate">{character.location.name}</span>
        </p>
      </div>
    </Link>
  );
}

function CharacterSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] animate-pulse bg-slate-200 motion-reduce:animate-none" />
      <div className="space-y-4 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

export default function RickAndMortyExplorer() {
  const [filters, setFilters] = useState(initialFilters);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      const searchParams = new URLSearchParams({ page: String(page) });
      for (const [key, value] of Object.entries(filters)) {
        if (value.trim()) {
          searchParams.set(key, value.trim());
        }
      }

      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?${searchParams.toString()}`,
          { signal: controller.signal },
        );

        if (response.status === 404) {
          setCharacters([]);
          setPages(1);
          return;
        }
        if (!response.ok) {
          throw new Error(`La API respondió con el estado ${response.status}.`);
        }

        const data: RickAndMortyApiResponse = await response.json();
        setCharacters(data.results);
        setPages(data.info.pages);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setCharacters([]);
        setError("No se pudo abrir el portal. Comprueba tu conexión e inténtalo de nuevo.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [filters, page]);

  function updateFilter(key: keyof CharacterFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  return (
    <main className="relative mx-auto min-h-[calc(100vh-150px)] w-full max-w-7xl px-5 py-12 sm:px-8">
      <section className="relative mx-auto grid max-w-6xl items-center gap-8 py-10 sm:py-14 lg:min-h-[510px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-emerald-50 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399]" />
            Archivo interdimensional
          </span>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-900 sm:text-6xl xl:text-7xl">
            No existe un solo{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
              universo.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Cada portal abre una historia distinta. Encuentra a tus personajes
            favoritos y descubre qué hay al otro lado.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#character-index"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(16,185,129,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-[0_12px_36px_rgba(16,185,129,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <IoSearch aria-hidden="true" />
              Explorar personajes
            </a>
            <span className="inline-flex items-center gap-2 px-2 py-3 text-xs text-slate-600">
              <IoPlanet className="text-cyan-700" aria-hidden="true" />
              20 señales por dimensión
            </span>
          </div>
          <div className="mt-10 flex max-w-md gap-8 border-t border-slate-200 pt-5">
            <div>
              <p className="text-2xl font-bold tracking-tight text-slate-900">04</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filtros de búsqueda
              </p>
            </div>
            <div className="border-l border-slate-200 pl-8">
              <p className="text-2xl font-bold tracking-tight text-slate-900">∞</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Posibles realidades
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
          <div className="portal-ring portal-ring-outer absolute inset-[4%] rounded-full border border-cyan-300/15" />
          <div className="portal-ring portal-ring-middle absolute inset-[11%] rounded-full border border-emerald-300/25" />
          <div className="absolute inset-[17%] rounded-full bg-gradient-to-br from-emerald-400/15 via-cyan-400/10 to-transparent blur-2xl" />
          {characters[0] ? (
            <Link
              href={`/rickandmorty/${characters[0].id}`}
              className="featured-character group relative z-10 flex size-[70%] items-center justify-center overflow-hidden rounded-full border border-emerald-600/30 bg-gradient-to-br from-emerald-100 via-white to-cyan-100 shadow-[0_0_70px_rgba(16,185,129,0.16)] transition duration-300 hover:border-emerald-500/60 hover:shadow-[0_0_90px_rgba(16,185,129,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Abrir expediente de ${characters[0].name}`}
            >
              <div className="absolute inset-3 overflow-hidden rounded-full bg-slate-100">
                <Image
                  src={characters[0].image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 70vw, 360px"
                  priority={false}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
                  <IoSparkles aria-hidden="true" />
                  Señal destacada
                </span>
                <span className="mt-2 block truncate text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                  {characters[0].name}
                </span>
                <span className="mt-1 block text-xs text-slate-300">
                  {characters[0].species} · {characters[0].origin.name}
                </span>
              </div>
            </Link>
          ) : (
            <div
              className="relative z-10 grid size-[70%] place-items-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-[0_0_70px_rgba(16,185,129,0.16)]"
              aria-hidden="true"
            >
              <IoPlanet className="text-7xl opacity-70" />
            </div>
          )}
          <span className="absolute right-0 top-[22%] rounded-full border border-cyan-200 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-800 shadow-xl backdrop-blur">
            Earth C-137
          </span>
          <span className="absolute bottom-[17%] left-0 rounded-full border border-emerald-200 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 shadow-xl backdrop-blur">
            Multiverse index
          </span>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6"
        aria-labelledby="filter-heading"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="filter-heading"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <IoFilter className="text-emerald-300" aria-hidden="true" />
            Filtros del portal
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors duration-200 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Limpiar filtros
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-600">
              Nombre
            </span>
            <span className="relative block">
              <IoSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={filters.name}
                onChange={(event) => updateFilter("name", event.target.value)}
                placeholder="Rick, Morty..."
                className="portal-input w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-600">
              Estado
            </span>
            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="portal-input w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"
            >
              <option value="">Todos los estados</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-600">
              Género
            </span>
            <select
              value={filters.gender}
              onChange={(event) => updateFilter("gender", event.target.value)}
              className="portal-input w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"
            >
              <option value="">Todos los géneros</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-600">
              Tipo / variante
            </span>
            <input
              type="search"
              value={filters.type}
              onChange={(event) => updateFilter("type", event.target.value)}
              placeholder="Human, Parasite..."
              className="portal-input w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </label>
        </div>
      </section>

      <section
        id="character-index"
        className="mx-auto mt-12 max-w-6xl scroll-mt-8"
        aria-live="polite"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <IoTvOutline className="mr-2 inline-block" aria-hidden="true" />
              Registros detectados
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Personajes del multiverso
            </h2>
          </div>
          {!loading && !error && characters.length > 0 && (
            <p className="text-sm text-slate-400">
              Página <span className="text-slate-900">{page}</span> de{" "}
              <span className="text-slate-900">{pages}</span>
            </p>
          )}
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <p className="text-lg font-semibold text-red-800">Señal perdida</p>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <CharacterSkeleton key={index} />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <IoPlanet
              className="mx-auto text-4xl text-emerald-600"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Esta dimensión está vacía
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              No encontramos personajes con esos filtros. Prueba con otra
              combinación.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-emerald-600/30 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors duration-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
            <nav
              aria-label="Paginación de personajes"
              className="mt-8 flex items-center justify-center gap-4"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition-colors duration-200 hover:border-emerald-500/60 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-600">
                {page} / {pages}
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() =>
                  setPage((current) => Math.min(pages, current + 1))
                }
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition-colors duration-200 hover:border-emerald-500/60 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
