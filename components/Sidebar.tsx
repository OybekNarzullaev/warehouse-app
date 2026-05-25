// components/Sidebar.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, LogOut, X } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logOut } = UserAuth();

  return (
    <>
      {/* Telefonda Sidebar orqasidagi qoraytirilgan fon */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebarning o'zi */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white h-screen border-r border-gray-200 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Package className="text-blue-600 mr-2" size={24} />
              <span className="text-xl font-bold text-gray-800">Omborxona</span>
            </div>
            {/* Telefonda yopish tugmasi */}
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <Link
              href="/"
              onClick={onClose} // Bosilganda yopilishi uchun
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors"
            >
              <LayoutDashboard size={20} />
              Bosh panel
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 mb-4">
          <button
            onClick={logOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            Tizimdan chiqish
          </button>
        </div>
      </div>
    </>
  );
}
