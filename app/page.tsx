// app/page.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AddProduct from "@/components/AddProduct";
import ProductList from "@/components/ProductList";

export default function Home() {
  const { user, loading } = UserAuth();
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // YANGI: Sidebar holati

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - endi state orqali boshqariladi */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen w-full">
        {/* Navbar - unga menyuni ochish funksiyasini beramiz */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Bu yerda mobilda yon tomonlarga (padding) biroz o'zgartirish kiritdik: p-4 md:p-6 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Omborxona Boshqaruvi
              </h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                <PlusCircle size={20} />
                Yangi mahsulot
              </button>
            </div>

            <AddProduct
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            />

            <ProductList />
          </div>
        </main>
      </div>
    </div>
  );
}
