"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);
    setMessage(null);

    // 1️⃣ Registrar usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
       email: email.trim(),
      password,
    });

    // ❌ Error de autenticación
    if (error) {
      setMessage("❌ " + error.message);
      setLoading(false);
      return;
    }

    // 📌 Obtener ID del usuario
    const userId = data.user?.id;

    if (!userId) {
      setMessage("❌ No se pudo obtener el ID del usuario.");
      setLoading(false);
      return;
    }

    // 2️⃣ Guardar información extra en profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          username,
        },
      ]);

    // ❌ Error guardando perfil
    if (profileError) {
      setMessage("⚠️ Usuario creado pero perfil no guardado.");
      setLoading(false);
      return;
    }

    // ✅ Registro exitoso
    setMessage(
      "✅ Cuenta creada correctamente. Revisa tu correo."
    );

    // Limpiar formulario
    setUsername("");
    setEmail("");
    setPassword("");

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl">

        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Apple Music
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Crea tu cuenta
        </p>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700 focus:border-pink-500"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700 focus:border-pink-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700 focus:border-pink-500"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 transition-all text-white p-3 rounded-lg font-semibold"
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>

        </form>

        {/* MENSAJE */}
        {
          message && (
            <p className="text-center text-sm text-zinc-300 mt-5">
              {message}
            </p>
          )
        }

      </div>

    </div>
  );
}