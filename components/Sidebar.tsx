// components/Sidebar.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { logOut } = UserAuth();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Package className="text-blue-600 mr-2" size={24} />
          <span className="text-xl font-bold text-gray-800">Omborxona</span>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            Bosh panel
          </Link>
          {/* Kelajakda qo'shiladigan sahifalar uchun joy */}
          {/* <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium transition-colors">
            <Box size={20} />
            Mahsulotlar
          </Link> */}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          Tizimdan chiqish
        </button>
      </div>
    </div>
  );
}
