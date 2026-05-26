"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
}

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Estados para el Modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  // 🔄 Cargar usuario y sus playlists desde la base de datos
  const fetchPlaylists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("playlists")
        .select("id, title, description, cover_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setPlaylists(data);
    } catch (err: any) {
      console.error("Error al obtener playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // ➕ Guardar nueva playlist en Supabase (Con alerta de depuración)
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newTitle.trim()) {
      alert("El título es obligatorio");
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("playlists")
        .insert([
          {
            user_id: userId,
            title: newTitle.trim(),
            description: newDescription.trim() || null, // Guardamos null si viene vacío
            cover_url: null,
          },
        ])
        .select(); // El .select() fuerza a Supabase a validar la fila con el RLS

      if (error) {
        // Alerta interactiva clave para ver el error exacto en el celular/WebView
        alert(`Error de Supabase [${error.code}]: ${error.message}\n\nVerifica si te falta la política de INSERT en la tabla playlists.`);
        console.error("Detalle del error de Supabase:", error);
        throw error;
      }

      // Resetear el formulario y cerrar el modal si todo salió bien
      setNewTitle("");
      setNewDescription("");
      setIsModalOpen(false);
      
      // Recargar la lista de reproducción
      fetchPlaylists();
    } catch (err: any) {
      console.error("Error atrapado en el catch:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* 🖥️ SIDEBAR (Solo visible en Escritorio) */}
      <aside className="w-[260px] bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col shrink-0">
        <h1 className="text-3xl font-bold mb-10">Apple Music</h1>
        <nav className="flex flex-col gap-5 text-zinc-300">
          <Link href="/mvp" className="text-left hover:text-white transition">Inicio</Link>
          <button className="text-left hover:text-white transition">Explorar</button>
          <Link href="/library" className="text-left hover:text-white transition">Biblioteca</Link>
          <button className="text-left hover:text-white transition text-pink-500 font-semibold">Playlist</button>
        </nav>
      </aside>

      {/* 📱 NAVBAR INFERIOR (Solo visible en Celulares / APK) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex justify-around items-center md:hidden z-40 text-[11px] text-zinc-400">
        <button 
          onClick={() => router.push("/mvp")} 
          className="flex flex-col items-center gap-1 active:scale-95 transition"
        >
          <span className="text-lg"></span> Inicio
        </button>
        <button 
          onClick={() => alert("Explorar próximamente")} 
          className="flex flex-col items-center gap-1 active:scale-95 transition"
        >
          <span className="text-lg"></span> Explorar
        </button>
        <button 
          onClick={() => router.push("/library")} 
          className="flex flex-col items-center gap-1 active:scale-95 transition"
        >
          <span className="text-lg"></span> Biblioteca
        </button>
        <button 
          onClick={() => router.push("/playlist")} 
          className="flex flex-col items-center gap-1 text-pink-500 active:scale-95 transition"
        >
          <span className="text-lg"></span> Playlists
        </button>
      </nav>

      {/* 📜 CONTENIDO PRINCIPAL */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        
        {/* HEADER */}
        <div className="p-4 md:p-8 border-b border-zinc-900 flex flex-col gap-2">
          {/* Botón Atrás para móvil */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-pink-500 font-medium text-base md:hidden self-start active:scale-95 transition"
          >
            <span className="text-xl">◀</span> Atrás
          </button>

          <div className="flex items-center justify-between mt-2 md:mt-0">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-1">Mis Playlists</h1>
              <p className="text-zinc-400 text-sm md:text-base">Colecciones creadas por ti</p>
            </div>
            {/* Botón Añadir */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-pink-600 hover:bg-pink-700 active:scale-95 transition text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg"
            >
              + Nueva
            </button>
          </div>
        </div>

        {/* LISTADO / GRID DE PLAYLISTS */}
        <div className="p-4 md:p-8">
          {loading ? (
            <p className="text-zinc-400 text-sm">Cargando listas...</p>
          ) : playlists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm mb-4">No has creado ninguna playlist todavía.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-pink-500 font-medium text-sm hover:underline"
              >
                Crea tu primera lista aquí
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-zinc-900/50 rounded-xl overflow-hidden hover:bg-zinc-800/80 transition flex flex-col cursor-pointer animate-fade-in"
                >
                  {/* Portada por defecto */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-pink-800 to-zinc-900 flex items-center justify-center">
                    {playlist.cover_url ? (
                      <Image
                        src={playlist.cover_url}
                        alt={playlist.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl shadow-sm"></span>
                    )}
                  </div>

                  <div className="p-3 min-w-0">
                    <h3 className="font-medium text-sm md:text-base truncate">{playlist.title}</h3>
                    <p className="text-zinc-500 text-xs truncate mt-0.5">
                      {playlist.description || "Sin descripción"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 🏙️ MODAL EMERGENTE (Crear Playlist) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">Nueva Playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1 font-semibold">Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mix para entrenar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1 font-semibold">Descripción (Opcional)</label>
                <textarea
                  placeholder="De qué trata esta playlist..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {isCreating ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}