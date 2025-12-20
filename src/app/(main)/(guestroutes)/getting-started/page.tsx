"use client";

import Link from "next/link";
import { EnvelopeIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export default function GettingStarted() {
  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #007E51 0%, #005738 50%, #242424 100%)"
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-2 px-6">
        <img 
          src="/img/agpai-logo.png" 
          alt="Masjid" 
          className="w-20 h-20 object-contain"
        />
        <p className="text-white text-center text-lg font-bold">
          Assalamualaikum,
        </p>
        <p className="text-white text-center text-base">
          Selamat datang di <span className="font-semibold">AGPAII</span> 🌙
        </p>
      </div>

      {/* Image Tasbih - Positioned at right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none top-[400px]">
        <img 
          src="/img/ilustrasi_tasbih.png" 
          alt="Tasbih" 
          className="w-[320px] h-auto object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 top-[240px]">
        <p className="text-white text-center text-base mb-4 px-4">
          Buat akun Anda untuk menyimpan pengajaran
        </p>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Link
            href="/auth/login/email"
            className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full bg-[#00DB81] text-white font-medium hover:bg-[#00c573] transition"
          >
            <EnvelopeIcon className="w-6 h-6" />
            <span>Lanjut dengan Email</span>
          </Link>

          <Link
            href="/auth/login/nik"
            className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full bg-[#FDFDFD] text-black font-medium hover:bg-gray-100 transition"
          >
            <IdentificationIcon className="w-6 h-6" />
            <span>Lanjut dengan NIK</span>
          </Link>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <Link
            href="/auth/register"
            className="block w-full py-4 bg-[#004C41] text-white font-medium rounded-full text-center hover:bg-[#1a1a1a] transition"
          >
            Daftar Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
