"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);
    setMessage(null);

    // 🔐 Login con Supabase
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    // ❌ Error
    if (error) {
      setMessage("❌ " + error.message);
      setLoading(false);
      return;
    }

    // ✅ Login exitoso
    if (data.user) {

      setMessage("✅ Bienvenido a Apple Music");

      // 🚀 Redirección al MVP
      setTimeout(() => {
        router.push("/mvp");
      }, 1000);

    } else {

      setMessage(
        "⚠️ No se encontró el usuario."
      );

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            ♪
          </div>

          <h1 className="text-3xl font-bold text-white">
            Apple Music
          </h1>

          <p className="text-zinc-400 mt-2">
            Inicia sesión en tu cuenta
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-pink-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-pink-500"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 transition-all text-white p-3 rounded-xl font-semibold"
          >
            {
              loading
                ? "Cargando..."
                : "Iniciar sesión"
            }
          </button>

        </form>

        {/* MENSAJES */}
        {
          message && (
            <p className="text-center text-sm text-zinc-300 mt-5">
              {message}
            </p>
          )
        }

        {/* REGISTER */}
        <div className="mt-6 text-center">

          <p className="text-zinc-400 text-sm">
            ¿No tienes cuenta?
          </p>

          <Link
            href="/auth-register"
            className="text-pink-500 hover:text-pink-400 text-sm font-medium"
          >
            Crear cuenta
          </Link>

        </div>

      </div>

    </div>
  );
}