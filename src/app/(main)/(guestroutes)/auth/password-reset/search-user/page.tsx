"use client";
import Loader from "@/components/loader/loader";
import useDebounceValue from "@/utils/hooks/useDebounce";
import API from "@/utils/api/config";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounceValue(query, 500);

  const { data: users, isLoading } = useQuery({
    enabled: debouncedValue.length > 0 && query.length > 0,
    queryKey: ["user", debouncedValue],
    queryFn: async () => {
      const res = await API.get("/otp-client/search-name/" + debouncedValue);
      if (res.status == 200) return res.data;
    },
  });

  return (
    <div className="flex flex-col px-6 pt-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Cari Akun Anda
          </h2>
          <p className="text-gray-600">
            Masukkan nama akun yang Anda gunakan untuk mendaftar
          </p>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nama Akun
          </label>
          <input
            onKeyUp={(e: any) => setQuery(e.target.value)}
            type="text"
            className="w-full px-4 py-3 border-2 border-[#00AF70] rounded-lg focus:outline-none focus:border-[#00AF70] placeholder-gray-400"
            placeholder="Masukkan nama Anda"
          />
        </div>

        {/* Search Results */}
        {query.length > 0 && debouncedValue.length > 0 && (
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="size-8" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="border-2 border-[#00AF70] rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {users.map((user: any, i: number) => (
                    <Link
                      href={`/auth/password-reset?email=${user.email}`}
                      key={i}
                      className="block px-4 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {user.name.toLowerCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p className="font-medium">Akun tidak ditemukan</p>
                <p className="text-sm mt-1">Coba gunakan nama lain</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
