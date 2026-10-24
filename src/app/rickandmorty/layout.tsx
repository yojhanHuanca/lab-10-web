import type { Metadata } from "next";
import Link from "next/link";
import { IoFlask } from "react-icons/io5";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Multiverse Explorer | Rick and Morty",
    template: "%s | Multiverse Explorer",
  },
  description:
    "Explora personajes, dimensiones y expedientes del multiverso de Rick and Morty.",
};

export default function RickAndMortyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="multiverse-shell relative isolate min-h-screen overflow-hidden bg-white text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="portal-orb portal-orb-emerald absolute -left-48 -top-48 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-[150px]" />
        <div className="portal-orb portal-orb-cyan absolute -right-48 top-[35%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/15 blur-[150px]" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/rickandmorty"
            className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Multiverse Explorer, ir al explorador"
          >
            <span className="grid size-11 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
              <IoFlask className="flask-rotate text-2xl" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Interdimensional
              </span>
              <span className="block text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                Multiverse Explorer
              </span>
            </span>
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm sm:inline-flex">
            <span
              className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              aria-hidden="true"
            />
            Portal estable
          </span>
        </div>
      </header>

      {children}

      <footer className="relative z-10 border-t border-slate-200 px-5 py-6 text-center text-xs text-slate-500">
        Una ventana a infinitas realidades. Datos cortesía de Rick and Morty API.
      </footer>
    </div>
  );
}
