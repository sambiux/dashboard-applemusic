import Link from "next/link";

export default function Home() {

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="text-center max-w-xl">

        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-8">
          ♪
        </div>

        <h1 className="text-white text-5xl font-bold mb-4">
          Apple Music
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Más de 100 millones de canciones.
          Sin anuncios.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/auth-register"
            className="bg-pink-600 hover:bg-pink-700 transition-all text-white px-8 py-4 rounded-2xl font-semibold"
          >
            Registrarse
          </Link>

          <Link
            href="/auth-login"
            className="bg-zinc-900 hover:bg-zinc-800 transition-all border border-zinc-700 text-white px-8 py-4 rounded-2xl font-semibold"
          >
            Iniciar sesión
          </Link>

        </div>

      </div>

    </main>
  );
}