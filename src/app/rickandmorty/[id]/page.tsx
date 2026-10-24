import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IoArrowBack,
  IoCalendarOutline,
  IoEarthOutline,
  IoLocationOutline,
  IoLinkOutline,
  IoPeopleOutline,
  IoPlanetOutline,
  IoSparkles,
  IoTvOutline,
} from "react-icons/io5";
import type { Character } from "@/types/rickandmorty";

const apiBaseUrl = "https://rickandmortyapi.com/api/character";
const revalidateSeconds = 864000;

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function getCharacter(id: string): Promise<Character> {
  const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(id)}`, {
    next: { revalidate: revalidateSeconds },
  });

  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error(`Error al cargar el expediente: ${response.status}`);
  }

  return response.json();
}

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} — Expediente`,
    description: `Expediente interdimensional de ${character.name}: ${character.species}, ${character.status.toLowerCase()}, originario de ${character.origin.name}.`,
  };
}

function statusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "alive":
      return {
        text: "text-emerald-200",
        dot: "bg-emerald-400",
        glow: "shadow-[0_0_12px_rgba(52,211,153,0.8)]",
        pulse: true,
      };
    case "dead":
      return {
        text: "text-red-200",
        dot: "bg-red-500",
        glow: "shadow-[0_0_12px_#ef4444]",
        pulse: false,
      };
    default:
      return {
        text: "text-slate-300",
        dot: "bg-slate-400",
        glow: "",
        pulse: false,
      };
  }
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-emerald-400/60">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="mt-1 truncate font-semibold text-slate-900" title={value}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function CharacterDetail({
  params,
}: CharacterPageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    notFound();
  }
  const character = await getCharacter(id);
  const status = statusClasses(character.status);
  const createdDate = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(character.created));

  return (
    <main className="mx-auto min-h-[calc(100vh-150px)] w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/rickandmorty"
        className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <IoArrowBack aria-hidden="true" />
        Volver al explorador
      </Link>

      <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_100px_rgba(15,23,42,0.12)]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-slate-950 sm:min-h-[500px]">
            <Image
              src={character.image}
              alt={`Retrato de ${character.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:bottom-8">
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-950/75 px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${status.text}`}
              >
                <span className="relative flex size-2">
                  {status.pulse && (
                    <span
                      className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative inline-flex size-2 rounded-full ${status.dot} ${status.glow}`}
                    aria-hidden="true"
                  />
                </span>
                {character.status}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Expediente #{String(character.id).padStart(3, "0")}
              </p>
              <h1 className="mt-2 text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] sm:text-5xl">
                {character.name}
              </h1>
            </div>
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-emerald-300/30 shadow-[inset_0_0_35px_rgba(16,185,129,0.12)]" />
          </div>

          <div className="p-6 sm:p-9 lg:p-10">
            <div             className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <IoSparkles aria-hidden="true" />
              Archivo biográfico
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Identificación interdimensional
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Datos de origen, presencia y clasificación registrados en la
              base de datos del multiverso.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<IoPlanetOutline aria-hidden="true" />}
                title="Especie"
                value={character.species}
              />
              <InfoCard
                icon={<IoPeopleOutline aria-hidden="true" />}
                title="Género"
                value={character.gender}
              />
              <InfoCard
                icon={<IoSparkles aria-hidden="true" />}
                title="Tipo / variante"
                value={character.type || "Estándar / N/A"}
              />
              <InfoCard
                icon={<IoTvOutline aria-hidden="true" />}
                title="Episodios"
                value={`${character.episode.length} apariciones`}
              />
              <InfoCard
                icon={<IoEarthOutline aria-hidden="true" />}
                title="Origen"
                value={character.origin.name}
              />
              <InfoCard
                icon={<IoLocationOutline aria-hidden="true" />}
                title="Ubicación actual"
                value={character.location.name}
              />
            </div>

            <div className="mt-7 border-t border-slate-200 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Metadatos del sistema
              </p>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-slate-600">
                  <IoCalendarOutline
                    className="shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span>
                    Registro creado:{" "}
                    <time dateTime={character.created}>{createdDate}</time>
                  </span>
                </p>
                <a
                  href={character.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                >
                  <IoLinkOutline
                    className="shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  <span className="truncate">Abrir endpoint de la API</span>
                </a>
              </div>
            </div>

            <Link
              href="/rickandmorty"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-700/20 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-emerald-500/60 hover:bg-emerald-100 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <IoArrowBack aria-hidden="true" />
              Regresar a los personajes
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
