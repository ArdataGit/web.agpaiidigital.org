'use client';

import { useState, useEffect } from "react";
import TopBar from "@/components/nav/topbar";

/* ===============================
   INTERFACE
================================ */
interface IuranProvince {
  province_id: number;
  province_name: string;
  total_transaksi: number;
}

interface IuranUser {
  user_id: number;
  user_name: string;
  email: string;
  city_name: string | null;
  nominal: number;
  payment_date: string;
}

interface RankingProvince {
  rank: number;
  province_id: number;
  province_name: string;
  total_transaksi: number;
  total_pendaftaran: number;
  total_perpanjangan: number;
}

type ViewMode = "province" | "users" | "ranking";

export default function IuranPage() {
  /* ===============================
     FILTER
  ================================= */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [iuranType, setIuranType] = useState<"all" | "pendaftaran" | "perpanjangan">("all");

  /* ===============================
     VIEW STATE
  ================================= */
  const [view, setView] = useState<ViewMode>("province");
  const [selectedProvince, setSelectedProvince] = useState<IuranProvince | null>(null);

  /* ===============================
     DATA STATE
  ================================= */
  const [provinces, setProvinces] = useState<IuranProvince[]>([]);
  const [users, setUsers] = useState<IuranUser[]>([]);
  const [ranking, setRanking] = useState<RankingProvince[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     GET BULAN SAAT INI (untuk ranking)
  ================================= */
  const getCurrentMonthName = () => {
    const now = new Date();
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return monthNames[now.getMonth()];
  };

  /* ===============================
     GET JUDUL DINAMIS UNTUK PROVINSI
  ================================= */
  const getProvinceTitle = () => {
    if (!startDate || !endDate) {
      return "Data Iuran per Provinsi (Keseluruhan)";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    return `Data Iuran per Provinsi (${formatDate(start)} - ${formatDate(end)})`;
  };

  /* ===============================
     FETCH PROVINCES (Summary per Provinsi)
  ================================= */
  async function fetchProvinces() {
    setLoading(true);
    setView("province");
    const params = new URLSearchParams();
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }
    if (iuranType !== "all") {
      params.append("type", iuranType);
    }

    try {
      const res = await fetch(
        `https://admin.agpaiidigital.org/api/iuran/summary/province?${params}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setProvinces(json.data || []);
    } catch (err) {
      console.error("Error fetch provinces:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     FETCH USERS BY PROVINCE
  ================================= */
  async function fetchUsers(province: IuranProvince) {
    setSelectedProvince(province);
    setView("users");
    setLoading(true);

    const params = new URLSearchParams();
    if (startDate && endDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }
    if (iuranType !== "all") {
      params.append("type", iuranType);
    }

    try {
      const res = await fetch(
        `https://admin.agpaiidigital.org/api/iuran/province/${province.province_id}/users?${params}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setUsers(json.data || []);
    } catch (err) {
      console.error("Error fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     FETCH RANKING (Top Provinsi Bulan Ini)
  ================================= */
  async function fetchRankingThisMonth() {
    setView("ranking");
    setLoading(true);

    try {
      const res = await fetch(
        `https://admin.agpaiidigital.org/api/iuran/ranking/province/monthly`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setRanking(json.data || []);
    } catch (err) {
      console.error("Error fetch ranking:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProvinces();
  }, []);

  /* ===============================
     RENDER
  ================================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar withBackButton>Data Iuran</TopBar>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* FILTER + RANKING */}
      <div className="flex flex-col gap-4 mb-8 mt-10">
        {/* FILTER CARD */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Data Iuran
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sampai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis
              </label>
              <select
                value={iuranType}
                onChange={(e) => setIuranType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
              >
                <option value="all">Semua</option>
                <option value="pendaftaran">Pendaftaran</option>
                <option value="perpanjangan">Perpanjangan</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchProvinces}
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Memuat...
              </>
            ) : (
              "Terapkan Filter"
            )}
          </button>
        </div>

        {/* TOMBOL RANKING DI BAWAH CARD */}
        {view !== "ranking" && (
          <button
            onClick={fetchRankingThisMonth}
            disabled={loading}
            className="w-full px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            <span className="text-lg">
              🏆 Top Provinsi Bulan {getCurrentMonthName()}
            </span>
          </button>
        )}
      </div>

        {/* CONTENT AREA */}
        {loading && view !== "users" ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-gray-600 font-medium">Memuat data...</span>
          </div>
        ) : (
          <>
            {/* RANKING VIEW */}
            {view === "ranking" && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-5 border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold text-amber-800 flex items-center gap-3">
                    <span className="text-2xl">🏆</span> Ranking Provinsi Bulan {getCurrentMonthName()}
                  </h2>
                  <button
                    onClick={() => setView("province")}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    ← Kembali
                  </button>
                </div>

                {ranking.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Belum ada data ranking untuk bulan ini
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Provinsi</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Transaksi</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 hidden sm:table-cell">Pendaftaran</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 hidden sm:table-cell">Perpanjangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ranking.map((r) => (
                          <tr
                            key={r.province_id}
                            className={`${
                              r.rank <= 3 ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"
                            } transition`}
                          >
                            <td className="px-6 py-5 font-bold text-lg text-center">
                              {r.rank <= 3 ? (
                                <span className="text-yellow-600">#{r.rank}</span>
                              ) : (
                                <span className="text-gray-600">#{r.rank}</span>
                              )}
                            </td>
                            <td className="px-6 py-5 font-medium text-gray-900">
                              {r.province_name}
                            </td>
                            <td className="px-6 py-5 text-right font-semibold text-blue-600">
                              {r.total_transaksi.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-5 text-right text-gray-700 hidden sm:table-cell">
                              {r.total_pendaftaran.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-5 text-right text-gray-700 hidden sm:table-cell">
                              {r.total_perpanjangan.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PROVINCE VIEW */}
            {view === "province" && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-blue-800">
                    {getProvinceTitle()}
                  </h2>
                </div>

                {provinces.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Tidak ada data provinsi untuk filter yang dipilih
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {provinces.map((p) => (
                      <div
                        key={p.province_id}
                        onClick={() => fetchUsers(p)}
                        className="px-6 py-5 hover:bg-blue-50 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-700">
                            {p.province_name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-blue-600">
                            {p.total_transaksi.toLocaleString("id-ID")}
                          </span>
                          <p className="text-sm text-gray-500">Transaksi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS VIEW */}
            {view === "users" && selectedProvince && (
              <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b flex items-center justify-between">
                  <button
                    onClick={() => setView("province")}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                  >
                    ← Kembali ke Provinsi
                  </button>
                  <h2 className="text-lg font-semibold text-blue-800">
                    {selectedProvince.province_name}
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Tidak ada data pengguna untuk provinsi ini
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Nominal</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{u.user_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-semibold text-green-600">
                                Rp {u.nominal.toLocaleString("id-ID")}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-600">
                                {new Date(u.payment_date).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}