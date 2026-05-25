// components/Navbar.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = UserAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-800">Bosh Panel</h2>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {user.displayName}
          </span>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profil rasmi"
              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
