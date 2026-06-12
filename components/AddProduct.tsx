// components/AddProduct.tsx
"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserAuth } from "@/context/AuthContext";
import {
  PlusCircle,
  Image as ImageIcon,
  X,
  QrCode,
  ScanLine,
  Eraser,
} from "lucide-react";

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
}

// 10 ta mock (tayyor) mahsulotlar ro'yxati
// 10 ta mock (tayyor) mahsulotlar ro'yxati (Haqiqiy rasmlar bilan)
const mockProducts = [
  {
    name: "iPhone 15 Pro Max",
    category: "Smartfonlar",
    price: "1199.99",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop",
  },
  {
    name: "MacBook Air M3",
    category: "Noutbuklar",
    price: "1099.00",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop",
  },
  {
    name: "Sony WH-1000XM5",
    category: "Quloqchinlar",
    price: "349.99",
    imageUrl:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartfonlar",
    price: "1299.00",
    imageUrl:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop",
  },
  {
    name: "PlayStation 5",
    category: "O'yin konsollari",
    price: "499.99",
    imageUrl:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop",
  },
  {
    name: "Apple Watch Series 9",
    category: "Aqlli soatlar",
    price: "399.00",
    imageUrl:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&auto=format&fit=crop",
  },
  {
    name: "iPad Pro 12.9",
    category: "Planshetlar",
    price: "1099.00",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop",
  },
  {
    name: "Logitech MX Master 3",
    category: "Aksessuarlar",
    price: "99.99",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop",
  },
  {
    name: "LG UltraGear Monitor",
    category: "Monitorlar",
    price: "299.50",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
  },
  {
    name: "AirPods Pro",
    category: "Quloqchinlar",
    price: "249.00",
    imageUrl:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop",
  },
];

export default function AddProduct({ isOpen, onClose }: AddProductProps) {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const quantityRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    name: "",
    category: "",
    quantity: "",
    price: "",
    imageUrl: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  // Tasodifiy skanerlash simulyatsiyasi
  const handleSimulateScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // Ro'yxatdan tasodifiy (random) bittasini tanlash
      const randomIndex = Math.floor(Math.random() * mockProducts.length);
      const randomProduct = mockProducts[randomIndex];

      setFormData((prev) => ({
        ...prev,
        name: randomProduct.name,
        category: randomProduct.category,
        price: randomProduct.price,
        imageUrl: randomProduct.imageUrl,
      }));

      // Focus ni mahsulot soniga qaratish
      if (quantityRef.current) {
        quantityRef.current.focus();
      }
    }, 1500); // 1.5 soniya kutish
  };

  // Formani tozalash (Qo'lda kiritish uchun qulay)
  const handleClearForm = () => {
    setFormData(initialFormState);
  };

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

      setFormData(initialFormState);
      onClose();
    } catch (error) {
      console.error("Xatolik yuz berdi: ", error);
      alert("Mahsulot qo'shishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6 pr-10">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlusCircle className="text-blue-600" size={24} />
            Yangi mahsulot qo'shish
          </h3>

          {/* Formani tozalash tugmasi (Qo'lda kiritish uchun) */}
          <button
            onClick={handleClearForm}
            className="text-sm flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Eraser size={16} /> Tozalash
          </button>
        </div>

        {/* QR Kod Skanerlash Simulyatsiyasi */}
        <div className="mb-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all">
          {isScanning ? (
            <div className="flex flex-col items-center text-blue-600 animate-pulse">
              <ScanLine size={48} className="mb-2" />
              <p className="text-sm font-medium text-blue-800">
                Mahsulot bazadan qidirilmoqda...
              </p>
            </div>
          ) : (
            <>
              <QrCode size={40} className="text-blue-500 mb-2" />
              <p className="text-sm text-gray-600 mb-4 max-w-sm">
                QR kodni skaner qiling yoki quyidagi formani{" "}
                <b>qo'lda to'ldiring</b>.
              </p>
              <button
                type="button"
                onClick={handleSimulateScan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
              >
                <ScanLine size={18} /> Avto-to'ldirish (Skaner)
              </button>
            </>
          )}
        </div>

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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Masalan: Noutbuk yoki qo'lda kiriting..."
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Masalan: Elektronika"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="https://.../rasm.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">
              Soni (dona) *
            </label>
            <input
              ref={quantityRef}
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full border-2 border-blue-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-blue-50/30"
              placeholder="Shtrix kod o'qilgach, sonini kiriting"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Masalan: 500"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading || isScanning}
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
