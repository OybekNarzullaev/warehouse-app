// components/AddProduct.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserAuth } from "@/context/AuthContext";
import { PlusCircle, Image as ImageIcon, X } from "lucide-react";

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProduct({ isOpen, onClose }: AddProductProps) {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    imageUrl: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        ownerUid: user.uid,
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
        createdAt: serverTimestamp(),
      });

      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
        imageUrl: "",
      });
      onClose(); // Muvaffaqiyatli qo'shilgach, modalni yopish
    } catch (error) {
      console.error("Xatolik yuz berdi: ", error);
      alert("Mahsulot qo'shishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <PlusCircle className="text-blue-600" size={24} />
          Yangi mahsulot qo'shish
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomi
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masalan: Noutbuk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Toifasi
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Elektronika"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <ImageIcon size={14} /> Rasm URL manzili
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://.../rasm.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soni (dona)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Narxi ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="500"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Qo'shilmoqda..." : "Mahsulotni saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
