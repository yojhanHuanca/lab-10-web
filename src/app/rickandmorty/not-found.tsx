import Link from "next/link";
import { IoPlanetOutline } from "react-icons/io5";

export default function CharacterNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center px-5 py-16 text-center">
      <IoPlanetOutline className="text-6xl text-emerald-600" aria-hidden="true" />
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
        Coordenadas perdidas
      </p>
      <h1 className="mt-3 text-4xl font-black text-slate-900">Realidad no encontrada</h1>
      <p className="mt-3 max-w-md text-slate-600">
        No existe un expediente para estas coordenadas. Regresa al explorador y
        prueba otro universo.
      </p>
      <Link
        href="/rickandmorty"
        className="mt-7 rounded-xl border border-emerald-700/20 bg-emerald-50 px-5 py-3 font-semibold text-emerald-800 transition-colors duration-200 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        Volver al explorador
      </Link>
    </main>
  );
}
