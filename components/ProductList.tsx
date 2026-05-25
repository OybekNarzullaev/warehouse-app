// components/ProductList.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { UserAuth } from "@/context/AuthContext";
import {
  Trash2,
  Edit,
  Package,
  Search,
  Layers,
  CircleDollarSign,
  ClipboardCheck,
} from "lucide-react";
import Fuse from "fuse.js";
import EditProduct from "./EditProduct";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  ownerUid: string;
  ownerName: string;
  ownerPhoto: string;
}

export default function ProductList() {
  const { user } = UserAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  // Statistikalarni hisoblash
  const stats = useMemo(() => {
    return {
      totalTypes: products.length,
      totalItems: products.reduce((acc, curr) => acc + curr.quantity, 0),
      totalValue: products.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0,
      ),
      myProducts: products.filter((p) => p.ownerUid === user?.uid).length,
    };
  }, [products, user]);

  // Fuse.js qidiruv mantig'i
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "category", "ownerName"],
        threshold: 0.3,
        includeScore: true,
      }),
    [products],
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, products, fuse]);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Mahsulotlar yuklanmoqda...
      </div>
    );

  return (
    <div>
      {/* 📊 STATISTIKA KARTOCHKALARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Xilma-xillik (tur)
            </p>
            <h4 className="text-2xl font-bold text-gray-900">
              {stats.totalTypes}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Jami zaxira (dona)
            </p>
            <h4 className="text-2xl font-bold text-gray-900">
              {stats.totalItems}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Umumiy qiymat</p>
            <h4 className="text-2xl font-bold text-gray-900">
              ${stats.totalValue.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Mening mahsulotlarim
            </p>
            <h4 className="text-2xl font-bold text-gray-900">
              {stats.myProducts} ta
            </h4>
          </div>
        </div>
      </div>

      {/* 🔍 QIDIRUV PANELI */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Mahsulot nomi, toifasi yoki kirituvchi ismi bo'yicha qidiring..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-gray-700"
        />
        {searchQuery && (
          <div className="absolute right-3 top-3 text-sm text-gray-500">
            Natija:{" "}
            <span className="font-bold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            ta
          </div>
        )}
      </div>

      {/* 📦 MAHSULOTLAR RO'YXATI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isOwner = user?.uid === product.ownerUid;

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              {/* Mahsulot rasmi */}
              <div className="h-48 w-full bg-gray-50 border-b border-gray-100 flex-shrink-0 relative group">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package size={48} strokeWidth={1} />
                  </div>
                )}
              </div>

              {/* Mahsulot ma'lumotlari */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md mt-1">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 mt-auto">
                  <div className="text-xl font-black text-gray-900">
                    ${product.price}
                  </div>
                  <div className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {product.quantity} ta
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div
                    className="flex items-center gap-2"
                    title={product.ownerName}
                  >
                    {product.ownerPhoto ? (
                      <img
                        src={product.ownerPhoto}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700">
                        {product.ownerName?.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs text-gray-500 truncate w-20">
                      {product.ownerName.split(" ")[0]}
                    </span>
                  </div>

                  {isOwner && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Agar mahsulot topilmasa */}
        {filteredProducts.length === 0 && searchQuery && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm">
            "{searchQuery}" bo'yicha hech narsa topilmadi. Boshqa so'z bilan
            izlab ko'ring.
          </div>
        )}

        {/* Agar umuman mahsulot bo'lmasa */}
        {filteredProducts.length === 0 && !searchQuery && (
          <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            Omborda hozircha mahsulot yo'q. Birinchi bo'lib qo'shing!
          </div>
        )}
      </div>

      {/* ✏️ TAHRIRLASH MODALI */}
      <EditProduct
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
      />
    </div>
  );
}
