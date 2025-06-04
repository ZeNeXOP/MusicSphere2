import React from "react";

const placeholderSongs = [
  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
  { title: "Peaches", artist: "Justin Bieber", duration: "3:18" },
  { title: "Save Your Tears", artist: "The Weeknd", duration: "3:35" },
  { title: "Good 4 U", artist: "Olivia Rodrigo", duration: "2:58" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", duration: "2:21" },
  {
    title: "Montero (Call Me By Your Name)",
    artist: "Lil Nas X",
    duration: "2:17",
  },
  { title: "Kiss Me More", artist: "Doja Cat ft. SZA", duration: "3:28" },
  { title: "drivers license", artist: "Olivia Rodrigo", duration: "4:02" },
  {
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    duration: "3:32",
  },
];

const PlaylistView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Chill Vibes</h1>
        <p className="text-neutral-400">
          A playlist of trending hits and chill tracks.
        </p>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg bg-[#181818]">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-neutral-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">#</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Artist</th>
              <th className="px-6 py-3 font-medium text-right">Duration</th>
            </tr>
          </thead>
          <tbody>
            {placeholderSongs.map((song, idx) => (
              <tr
                key={idx}
                className="group hover:bg-neutral-800 transition cursor-pointer"
              >
                <td className="px-6 py-4 text-neutral-400 w-8">
                  <span className="group-hover:hidden">{idx + 1}</span>
                  <button className="hidden group-hover:inline-flex items-center justify-center p-1 rounded-full bg-green-500 hover:bg-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-white group-hover:text-green-400">
                  {song.title}
                </td>
                <td className="px-6 py-4 text-neutral-300">{song.artist}</td>
                <td className="px-6 py-4 text-neutral-400 text-right">
                  {song.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistView;
