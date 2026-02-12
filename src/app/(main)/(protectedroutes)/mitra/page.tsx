"use client";

import TopBar from "@/components/nav/topbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ===============================
   INTERFACE
================================ */
interface MitraItem {
	id: number;
	mitra: string;
	deskripsi: string;
	external_url: string;
	gambar: string | null;
	kategori: {
		id: number | null;
		nama: string | null;
	};
}

const MitraPage: React.FC = () => {
	const router = useRouter();
	const API_URL = "https://admin.agpaiidigital.org";

	const [mitraList, setMitraList] = useState<MitraItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	/* ===============================
	   FETCH ALL MITRA (NO FILTER)
	================================ */
	useEffect(() => {
		const fetchMitra = async () => {
			setLoading(true);
			try {
				const res = await axios.get<{
					success: boolean;
					data: MitraItem[];
				}>(`${API_URL}/api/mitra`);

				setMitraList(res.data.data || []);
			} catch (error) {
				console.error("Gagal mengambil data mitra:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMitra();
	}, []);

	/* ===============================
	   RENDER
	================================ */
	return (
		<div className="pt-[4.21rem] bg-white min-h-screen">
			<TopBar withBackButton>MITRA AGPAII</TopBar>

			<div className="p-6">
				{/* HEADER IMAGE */}
				<div className="mb-6">
					<img
						src="/img/partner-profile.png"
						alt="Mitra AGPAII"
						className="w-full h-[220px] object-cover rounded-lg"
					/>
				</div>

				{/* DESKRIPSI */}
				<p className="text-gray-600 text-sm mb-8">
					Mitra AGPAII adalah mitra strategis bagi para pendidik Pendidikan
					Agama Islam (PAI) di seluruh Indonesia. Kami bekerja sama dengan
					berbagai pihak untuk menghadirkan program, layanan, dan solusi
					yang mendukung peningkatan kualitas pendidikan PAI secara
					berkelanjutan.
				</p>
              
              
                {/* TOMBOL TAMBAH MITRA */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => router.push("/mitra/new")}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tambah Mitra
                  </button>
                </div>


				{/* LOADING */}
				{loading && (
					<div className="text-center py-10 text-gray-500">
						Memuat data mitra...
					</div>
				)}

				{/* LIST MITRA */}
				{!loading && mitraList.length === 0 && (
					<div className="text-center py-10 text-gray-500">
						Data mitra belum tersedia
					</div>
				)}

				{!loading && mitraList.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{mitraList.map((item) => (
							<div
								key={item.id}
								onClick={() => router.push(`/mitra/${item.id}`)}
								className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
							>
								{/* GAMBAR */}
								{item.gambar && (
									<img
										src={item.gambar}
										alt={item.mitra}
										className="w-full h-[140px] object-cover rounded mb-4"
									/>
								)}

								{/* TITLE */}
								<h3 className="font-semibold text-gray-900 mb-1">
									{item.mitra}
								</h3>

								{/* KATEGORI (INFO SAJA, BUKAN FILTER) */}
								{item.kategori?.nama && (
									<p className="text-xs text-green-600 mb-2">
										{item.kategori.nama}
									</p>
								)}

								{/* DESKRIPSI */}
								<p className="text-sm text-gray-600 line-clamp-3">
									{item.deskripsi}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MitraPage;
