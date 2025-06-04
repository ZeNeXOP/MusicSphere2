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

const Queue: React.FC = () => {
  return (
    <aside className="w-80 bg-[#181818] text-white h-full flex flex-col border-r border-neutral-800 shadow-lg">
      <div className="px-6 py-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold tracking-tight mb-1">Queue</h2>
        <p className="text-xs text-neutral-400">Your current queue</p>
      </div>
      <ul className="flex-1 overflow-y-auto divide-y divide-neutral-800">
        {placeholderSongs.map((song, idx) => (
          <li
            key={idx}
            className="flex items-center px-6 py-3 hover:bg-neutral-800 transition group cursor-pointer"
          >
            <span className="text-neutral-400 w-6 text-right mr-3">
              {idx + 1}
            </span>
            <div className="flex-1">
              <div className="font-medium text-sm group-hover:text-green-400">
                {song.title}
              </div>
              <div className="text-xs text-neutral-400">{song.artist}</div>
            </div>
            <span className="text-xs text-neutral-400 mr-4">
              {song.duration}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition p-1 rounded-full bg-green-500 hover:bg-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Queue;
