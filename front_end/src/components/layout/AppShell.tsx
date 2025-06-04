import React from "react";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import Player from "../player";
import Queue from "../Queue";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-8 py-8 bg-background">
          {children}
        </main>
        <div className="hidden md:block h-full">
          <Queue />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 z-40">
        <Player />
      </div>
    </div>
  );
};

export default AppShell;
