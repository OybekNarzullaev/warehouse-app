// app/login/page.tsx
"use client";

import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package } from "lucide-react";

export default function LoginPage() {
  const { user, googleSignIn } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Login xatoligi: ", error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Package size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Omborxonaga Xush Kelibsiz
        </h1>
        <p className="text-gray-500 mb-8">Davom etish uchun tizimga kiring</p>

        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          {/* Google ikonkasini ko'rsatish uchun img */}
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google orqali kirish
        </button>
      </div>
    </div>
  );
}
