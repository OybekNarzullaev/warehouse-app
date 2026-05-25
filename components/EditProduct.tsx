// components/EditProduct.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Edit3, Image as ImageIcon, X } from "lucide-react";

// Product interfeysini bu yerda ham yozib olamiz
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface EditProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function EditProduct({
  isOpen,
  onClose,
  product,
}: EditProductProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    imageUrl: "",
  });

  // Modal ochilganda, formani tanlangan mahsulot ma'lumotlari bilan to'ldirish
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
      });

      onClose(); // Muvaffaqiyatli yangilangach, modalni yopish
    } catch (error) {
      console.error("Yangilashda xatolik yuz berdi: ", error);
      alert("Mahsulotni yangilashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Edit3 className="text-blue-600" size={24} />
          Mahsulotni tahrirlash
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
            />
          </div>

          <div className="md:col-span-2 mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
