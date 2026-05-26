"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
}

export default function MVPPage() {
  const songs: Song[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Que lio",
      artist: "Blessd",
      image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Fd15329d41f13626e1c9b4650526affad.1000x1000x1.png",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      title: "MAS RARO",
      artist: "Blessd",
      image: "https://images.genius.com/1c336ad058ba7f137ab1c8d338747358.1000x1000x1.png",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      title: "Trinidad Bendita",
      artist: "Blessd",
      image: "https://i.scdn.co/image/ab67616d0000b273ece85a893843b0963f4b8a2b",
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      title: "Superstar",
      artist: "Blessd",
      image: "https://akamai.sscdn.co/letras/360x360/albuns/8/5/f/6/4808561776453060.jpg",
    },
    {
      id: "55555555-5555-5555-5555-555555555555",
      title: "todo contigo",
      artist: "Blessd",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfJF3CihRc8ytM8pbJ54jHLwVhMjMnpxHNg&s",
    },
    {
      id: "66666666-6666-6666-6666-666666666666",
      title: "EMHDM",
      artist: "Blessd",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfJF3CihRc8ytM8pbJ54jHLwVhMjMnpxHNg&s",
    },
  ];

  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndLikes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("liked_songs")
        .select("song_id")
        .eq("user_id", user.id);

      if (error) return;
      if (data) {
        const likedIds = data.map((item) => item.song_id);
        setLikedSongs(likedIds);
      }
    };
    fetchUserAndLikes();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error al cerrar sesion: " + error.message);
    } else {
      router.push("/");
    }
  };

  const toggleLike = async (songId: string) => {
    if (!userId) return;
    const alreadyLiked = likedSongs.includes(songId);

    if (alreadyLiked) {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("song_id", songId)
        .eq("user_id", userId);

      if (!error) setLikedSongs((prev) => prev.filter((id) => id !== songId));
    } else {
      const { error } = await supabase
        .from("liked_songs")
        .insert([{ song_id: songId, user_id: userId }]);

      if (!error) setLikedSongs((prev) => [...prev, songId]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* SIDEBAR (Escritorio) */}
      <aside className="w-[260px] bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-10">Apple Music</h1>
          <nav className="flex flex-col gap-5 text-zinc-300">
            <Link href="/mvp" className="text-left text-white font-semibold">Inicio</Link>
            <button className="text-left hover:text-white transition">Explorar</button>
            <Link href="/library" className="text-left hover:text-white transition">Biblioteca</Link>
            <Link href="/playlist" className="text-left hover:text-white transition">Playlist</Link>
          </nav>
        </div>
      </aside>

      {/* NAVBAR INFERIOR (Celulares) */}
      <nav className="fixed bottom-[80px] left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex justify-around items-center md:hidden z-50 text-[12px] text-zinc-400">
        <button 
          onClick={() => router.push("/mvp")} 
          className="flex flex-col items-center justify-center w-full h-full text-pink-500 font-medium"
        >
          Inicio
        </button>
        <button 
          onClick={() => alert("Explorar proximamente")} 
          className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition"
        >
          Explorar
        </button>
        <button 
          onClick={() => router.push("/library")} 
          className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition"
        >
          Biblioteca
        </button>
        <button 
          onClick={() => router.push("/playlist")} 
          className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition"
        >
          Playlists
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL (Usa relative para posicionar el boton de cerrar sesion perfectamente) */}
      <main className="flex-1 pb-40 md:pb-32 overflow-y-auto relative">
        
        {/* BOTON CERRAR SESION COMPACTO Y ELEGANTE */}
        <button
          onClick={handleSignOut}
          className="absolute top-6 right-6 z-40 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md transition active:scale-95 shadow-md"
        >
          Cerrar Sesion
        </button>

        {/* HERO */}
        <section className="h-[240px] md:h-[320px] bg-gradient-to-b from-pink-700 to-black flex items-end p-6 md:p-10">
          <div className="w-full min-w-0 pr-32"> 
            {/* El pr-32 asegura que los titulos jamas se pisen con el boton */}
            <p className="text-zinc-300 text-xs md:text-sm mb-1 uppercase tracking-wider font-semibold">
              Escuchando ahora
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-2 line-clamp-1">
              {currentSong.title}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg truncate">
              {currentSong.artist}
            </p>
          </div>
        </section>

        {/* RECIENTES */}
        <section className="p-4 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold">Escuchado recientemente</h3>
            <button className="text-sm text-pink-500 font-medium hover:underline">Ver todo</button>
          </div>

          {/* GRID RESPONSIVO */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => setCurrentSong(song)}
                className="bg-zinc-900/50 hover:bg-zinc-800/80 transition rounded-xl overflow-hidden cursor-pointer flex flex-col"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={song.image}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3 flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm md:text-base truncate">
                      {song.title}
                    </h4>
                    <p className="text-zinc-400 text-xs md:text-sm truncate">
                      {song.artist}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className={`text-xl transition active:scale-95 shrink-0 ${
                      likedSongs.includes(song.id) ? "text-pink-500" : "text-zinc-600"
                    }`}
                  >
                    ♥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* REPRODUCTOR GLOBAL */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex items-center justify-between px-4 md:px-6 z-50">
        
        <div className="flex items-center gap-3 min-w-0 max-w-[60%] md:max-w-[30%]">
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={currentSong.image}
              alt={currentSong.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm md:text-base truncate">{currentSong.title}</h4>
            <p className="text-zinc-400 text-xs md:text-sm truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-6 text-2xl">
          <button className="hidden sm:block text-zinc-400 hover:text-white transition">⏮</button>
          <button className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center text-lg shadow-md active:scale-95 transition">
            ▶
          </button>
          <button className="text-zinc-400 hover:text-white transition">⏭</button>
        </div>

        <div className="hidden md:block text-sm text-zinc-500 font-medium">
          Reproduciendo...
        </div>

      </div>

    </div>
  );
}