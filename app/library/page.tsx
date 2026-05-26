"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 Importamos para el botón de regresar

interface Song {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
}

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // 👈 Inicializamos el enrutador

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("liked_songs")
          .select(`
            songs (
              id,
              title,
              artist,
              cover_url
            )
          `)
          .eq("user_id", user.id);

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        if (data) {
          const formattedSongs = data
            .map((item: any) => item.songs)
            .filter(Boolean) as Song[];

          setSongs(formattedSongs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* 🖥️ SIDEBAR (Solo en escritorio) */}
      <aside className="w-[260px] bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col shrink-0">
        <h1 className="text-3xl font-bold mb-10">Apple Music</h1>
        <nav className="flex flex-col gap-5 text-zinc-300">
          <Link href="/mvp" className="text-left hover:text-white transition">Inicio</Link>
          <button className="text-left hover:text-white transition">Explorar</button>
          <button className="text-left hover:text-white transition text-pink-500 font-semibold">Biblioteca</button>
          <button className="text-left hover:text-white transition">Playlist</button>
        </nav>
      </aside>

      {/* 📱 NAVBAR INFERIOR (Solo en móviles) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex justify-around items-center md:hidden z-50 text-[11px] text-zinc-400">
        <Link href="/mvp" className="flex flex-col items-center gap-1">
          <span className="text-lg"></span>
          Inicio
        </Link>
        <button className="flex flex-col items-center gap-1">
          <span className="text-lg"></span>
          Explorar
        </button>
        <button className="flex flex-col items-center gap-1 text-pink-500">
          <span className="text-lg"></span>
          Biblioteca
        </button>
        <button 
          onClick={() => router.push("/playlist")} 
          className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition"
        >
          Playlists
        </button>
      </nav>

      {/* 📜 CONTENIDO DE LA BIBLIOTECA */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        
        {/* HEADER CON BOTÓN ATRÁS PARA MÓVIL */}
        <div className="p-4 md:p-8 border-b border-zinc-900 flex flex-col gap-2">
          
          {/* Botón de regreso exclusivo para móviles */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-pink-500 font-medium text-base md:hidden self-start active:scale-95 transition"
          >
            <span className="text-xl">◀</span> Atrás
          </button>

          <div className="mt-2 md:mt-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-1 md:mb-3">
              Tu biblioteca
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Canciones que te gustan
            </p>
          </div>
        </div>

        {/* CONTENIDO / GRID */}
        <div className="p-4 md:p-8">
          {loading ? (
            <p className="text-zinc-400 text-sm">Cargando...</p>
          ) : songs.length === 0 ? (
            <p className="text-zinc-400 text-sm">No tienes canciones favoritas.</p>
          ) : (
            /* Grid adaptado: 2 columnas en celular, 3 en tablet, 5 en escritorio */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-zinc-900/50 rounded-xl overflow-hidden hover:bg-zinc-800/80 transition flex flex-col"
                >
                  {/* Arte del álbum responsivo */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={song.cover_url || "https://via.placeholder.com/220"}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info de la canción con textos truncados */}
                  <div className="p-3 min-w-0">
                    <h3 className="font-medium text-sm md:text-base truncate">
                      {song.title}
                    </h3>
                    <p className="text-zinc-400 text-xs md:text-sm truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}