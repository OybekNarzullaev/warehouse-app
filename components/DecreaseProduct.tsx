// components/DecreaseProduct.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { UserAuth } from "@/context/AuthContext";
import {
  MinusCircle,
  X,
  QrCode,
  ScanLine,
  Eraser,
  PackageMinus,
  ShieldAlert,
} from "lucide-react";

interface DecreaseProductProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl: string;
  ownerUid: string;
}

export default function DecreaseProduct({
  isOpen,
  onClose,
}: DecreaseProductProps) {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [decreaseAmount, setDecreaseAmount] = useState("");

  const quantityRef = useRef<HTMLInputElement>(null);

  // Modal ochilganda FAQAT shu userga tegishli mahsulotlarni yuklash
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!isOpen || !user) return;
      try {
        // Asosiy mantiq: Faqat joriy foydalanuvchining ID siga teng bo'lganlarni olamiz
        const q = query(
          collection(db, "products"),
          where("ownerUid", "==", user.uid),
        );

        const querySnapshot = await getDocs(q);
        const productsList: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() } as Product);
        });

        setMyProducts(productsList);
      } catch (error) {
        console.error("Mahsulotlarni yuklashda xatolik:", error);
      }
    };

    fetchMyProducts();
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Tasodifiy skanerlash simulyatsiyasi (Faqat userning O'Z mahsulotlaridan)
  const handleSimulateScan = () => {
    if (myProducts.length === 0) {
      alert(
        "Sizda hali o'zingizga tegishli mahsulotlar yo'q! Avval mahsulot qo'shing.",
      );
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // FAQAT o'ziga tegishli mahsulotlardan tasodifiy bittasini tanlash
      const randomIndex = Math.floor(Math.random() * myProducts.length);
      const randomProduct = myProducts[randomIndex];

      setSelectedProduct(randomProduct);
      setDecreaseAmount("");

      setTimeout(() => {
        if (quantityRef.current) {
          quantityRef.current.focus();
        }
      }, 100);
    }, 1500);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setDecreaseAmount("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Qo'shimcha xavfsizlik: Tanlangan mahsulot rostan shu usergami tekshiramiz
    if (!user || !selectedProduct || selectedProduct.ownerUid !== user.uid)
      return;

    const amountToDecrease = Number(decreaseAmount);

    if (amountToDecrease <= 0) {
      alert("Iltimos, noldan katta son kiriting!");
      return;
    }
    if (amountToDecrease > selectedProduct.quantity) {
      alert(`Xatolik! Bazada faqat ${selectedProduct.quantity} ta qolgan.`);
      return;
    }

    setLoading(true);
    try {
      const newQuantity = selectedProduct.quantity - amountToDecrease;

      const productRef = doc(db, "products", selectedProduct.id);
      await updateDoc(productRef, {
        quantity: newQuantity,
      });

      handleClearSelection();
      onClose();
    } catch (error) {
      console.error("Xatolik yuz berdi: ", error);
      alert("Mahsulotni kamaytirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6 pr-10">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PackageMinus className="text-red-500" size={24} />
            Sotish (Faqat sizning mahsulotlar)
          </h3>

          {selectedProduct && (
            <button
              onClick={handleClearSelection}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Eraser size={16} /> Bekor qilish
            </button>
          )}
        </div>

        {/* Ogohlantirish xabari */}
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs px-3 py-2 rounded-lg mb-4 border border-yellow-200">
          <ShieldAlert size={16} className="flex-shrink-0" />
          <p>
            Siz faqat o'zingiz kiritgan <b>{myProducts.length} ta</b> mahsulotni
            sota olasiz.
          </p>
        </div>

        {!selectedProduct ? (
          <div className="mb-2 bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all">
            {isScanning ? (
              <div className="flex flex-col items-center text-red-600 animate-pulse">
                <ScanLine size={48} className="mb-2" />
                <p className="text-sm font-medium text-red-800">
                  Sizning mahsulotlaringiz qidirilmoqda...
                </p>
              </div>
            ) : (
              <>
                <QrCode size={48} className="text-red-500 mb-3" />
                <p className="text-sm text-gray-600 mb-5 max-w-sm">
                  Shtrix kodni skaner qiling. Agar mahsulot sizniki bo'lmasa, u
                  topilmaydi.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-red-200"
                >
                  <ScanLine size={20} /> O'z mahsulotlarimni skanerlash
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <PackageMinus className="text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                  {selectedProduct.name}
                </h4>
                <div className="flex gap-3 text-sm text-gray-500">
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                    {selectedProduct.category}
                  </span>
                  <span>
                    Bazada bor:{" "}
                    <b className="text-green-600">
                      {selectedProduct.quantity} ta
                    </b>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-red-600 mb-2">
                Nechta kamaytirmoqchisiz? (dona) *
              </label>
              <input
                ref={quantityRef}
                type="number"
                required
                min="1"
                max={selectedProduct.quantity}
                value={decreaseAmount}
                onChange={(e) => setDecreaseAmount(e.target.value)}
                className="w-full border-2 border-red-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all bg-red-50/30"
                placeholder="Masalan: 2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                "Saqlanmoqda..."
              ) : (
                <>
                  <MinusCircle size={20} /> Ombor qoldig'ini yangilash
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
