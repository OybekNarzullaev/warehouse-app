// app/page.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react"; // MinusCircle qo'shildi
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AddProduct from "@/components/AddProduct";
import DecreaseProduct from "@/components/DecreaseProduct"; // Yangi komponent qo'shildi
import ProductList from "@/components/ProductList";

export default function Home() {
  const { user, loading } = UserAuth();
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDecreaseModalOpen, setIsDecreaseModalOpen] = useState(false); // Yangi state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Yuqori qism: Sarlavha va Tugmalar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Omborxona Boshqaruvi
              </h2>

              {/* Tugmalar guruhi */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsDecreaseModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <MinusCircle size={20} />
                  Sotish (Chiqim)
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <PlusCircle size={20} />
                  Yangi mahsulot
                </button>
              </div>
            </div>

            {/* Modallar */}
            <AddProduct
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            />

            <DecreaseProduct
              isOpen={isDecreaseModalOpen}
              onClose={() => setIsDecreaseModalOpen(false)}
            />

            {/* Mahsulotlar ro'yxati */}
            <ProductList />
          </div>
        </main>
      </div>
    </div>
  );
}
