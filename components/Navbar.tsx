// components/Navbar.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = UserAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Telefonda ko'rinadigan Menu tugmasi */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Bosh Panel
        </h2>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user.displayName}
          </span>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profil rasmi"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
