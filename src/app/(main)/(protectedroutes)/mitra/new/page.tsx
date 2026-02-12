'use client';

import { useState, useEffect } from "react";
import TopBar from "@/components/nav/topbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_URL = "https://admin.agpaiidigital.org";

/* ===============================
   INTERFACE
================================ */
interface KategoriMitra {
  id: number;
  kategori_mitra: string;
}

export default function CreateMitraPage() {
  const router = useRouter();

  /* ===============================
     FORM STATE
  ================================= */
  const [form, setForm] = useState({
    mitra: "",
    kategori_mitra_id: "",
    deskripsi: "",
    external_url: "",
  });
  const [gambar, setGambar] = useState<File | null>(null);
  const [kategoriList, setKategoriList] = useState<KategoriMitra[]>([]);
  const [loading, setLoading] = useState(false);
  const CREATED_BY = 1; // nanti dari auth user

  /* ===============================
     FETCH KATEGORI MITRA
  ================================= */
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get<{
          success: boolean;
          data: KategoriMitra[];
        }>(`${API_URL}/api/mitra/kategori`);
        setKategoriList(res.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil kategori mitra:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Tidak bisa mengambil daftar kategori mitra",
          confirmButtonColor: "#3085d6",
        });
      }
    };
    fetchKategori();
  }, []);

  /* ===============================
     SUBMIT HANDLER
  ================================= */
  const handleSubmit = async () => {
    if (
      !form.mitra.trim() ||
      !form.kategori_mitra_id ||
      !form.deskripsi.trim() ||
      !form.external_url.trim() ||
      !gambar
    ) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Semua field wajib diisi",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: "Menyimpan...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const fd = new FormData();
    fd.append("mitra", form.mitra.trim());
    fd.append("kategori_mitra_id", form.kategori_mitra_id);
    fd.append("deskripsi", form.deskripsi.trim());
    fd.append("external_url", form.external_url.trim());
    fd.append("gambar", gambar);
    fd.append("created_by", CREATED_BY.toString());

    try {
  await axios.post(`${API_URL}/api/mitra/store`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  Swal.close(); // tutup loading dulu

  await Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: "Mitra berhasil ditambahkan dan menunggu approval admin",
    confirmButtonColor: "#10B981",
  });

  router.push("/mitra");
} catch (error: unknown) {
    Swal.close();

    // ===============================
    // VALIDATION ERROR (422)
    // ===============================
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response || {};

      if (status === 422 && data?.errors) {
        const messages = Object.values(data.errors)
          .flat()
          .join("<br>");

        Swal.fire({
          icon: "warning",
          title: "Validasi Gagal",
          html: messages,
          confirmButtonColor: "#F59E0B",
        });
        return;
      }
    }

    // ===============================
    // GENERAL ERROR
    // ===============================
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Terjadi kesalahan saat menyimpan mitra. Silakan coba lagi.",
      confirmButtonColor: "#EF4444",
    });
  } finally {
    setLoading(false);
  }
};

  /* ===============================
     RENDER
  ================================= */
  return (
    <div className="pt-[4.21rem] min-h-screen bg-white">
      <TopBar withBackButton>Tambah Mitra</TopBar>

      <div className="p-6 max-w-xl mx-auto space-y-6">
        <input
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Nama Mitra"
          value={form.mitra}
          onChange={(e) => setForm({ ...form, mitra: e.target.value })}
        />

        <select
          className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={form.kategori_mitra_id}
          onChange={(e) => setForm({ ...form, kategori_mitra_id: e.target.value })}
        >
          <option value="">Pilih Kategori Mitra</option>
          {kategoriList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.kategori_mitra}
            </option>
          ))}
        </select>

        <textarea
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Deskripsi"
          rows={5}
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
        />

        <input
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="External URL (contoh: https://example.com)"
          value={form.external_url}
          onChange={(e) => setForm({ ...form, external_url: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Gambar Mitra
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGambar(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            "Simpan Mitra"
          )}
        </button>
      </div>
    </div>
  );
}