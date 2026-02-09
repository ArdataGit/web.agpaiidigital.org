"use client";

import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useAuth } from "@/utils/context/auth_context";
import clsx from "clsx";
import Link from "next/link";

export default function PlnTokenForm() {
  const { auth } = useAuth();

  const [meter, setMeter] = useState("");
  const [phone, setPhone] = useState("");

  const [options, setOptions] = useState<
    { id: string; name: string; price: number }[]
  >([]);

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const [saldo, setSaldo] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= SALDO ================= */
    useEffect(() => {
          if (!auth?.id) return;

          const fetchSaldo = async () => {
            try {
              const res = await fetch(
                `https://admin.agpaiidigital.org/api/agpay/wallet?user_id=${auth.id}`
              );
              const data = await res.json();

              const rawBalance =
                data?.balance ??
                data?.data?.balance ??
                0;

              setSaldo(Number(rawBalance));
            } catch {
              setSaldo(0);
            }
          };

          fetchSaldo();
        }, [auth?.id]);

    const formatRupiah = (value: number) =>
      `Rp ${value.toLocaleString("id-ID")}`;

  /* ================= TOKEN OPTIONS ================= */
  const fetchTokenOptions = async () => {
    setLoading(true);
    setError(null);
    setOptions([]);
    try {
      const res = await fetch(
        `https://admin.agpaiidigital.org/api/filter-products?category_id=19`
      );
      const data = await res.json();

      if (!res.ok || !data.results) throw new Error("Gagal memuat token PLN");

      setOptions(
        data.results.map((item: any) => ({
          id: item.code,
          name: item.name,
          price: item.price,
        }))
      );
    } catch (e: any) {
      setError(e.message || "Gagal memuat token PLN");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenOptions();
  }, []);

  /* ================= VOUCHER ================= */
  const validateVoucher = async () => {
    if (!voucherCode || !selectedCode) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://admin.agpaiidigital.org/api/tripay/ppob/validate-voucher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token || ""}`,
          },
          body: JSON.stringify({
            voucher_code: voucherCode,
            code: selectedCode,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setOriginalPrice(data.original_price);
      setFinalPrice(data.final_price);
    } catch (e: any) {
      setVoucherError(e.message || "Voucher tidak valid");
      setOriginalPrice(null);
      setFinalPrice(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRICE ================= */
  const subtotal = selectedPrice;
  const total = finalPrice !== null ? finalPrice : subtotal;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!meter || !phone || !selectedCode || total > saldo) return;

  setLoading(true);
  try {
    const res = await fetch(
      "https://admin.agpaiidigital.org/api/tripay/ppob/transaksi/pembelian",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token || ""}`,
        },
        body: JSON.stringify({
          user_id: auth.id,
          inquiry: "PLN",
          code: selectedCode,
          phone,
          no_meter_pln: meter,
          voucher_code: voucherCode || undefined,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Transaksi gagal");
    }

    // ✅ SUCCESS
    await Swal.fire({
      icon: "success",
      title: "Transaksi Berhasil",
      text: "Token PLN sedang diproses",
      confirmButtonColor: "#009788",
    });

    window.location.href = "/history";
  } catch (e: any) {
    const message = e?.message || "Terjadi kesalahan";
    const isSaldoError = message.toLowerCase().includes("saldo");

    await Swal.fire({
      icon: "error",
      title: "Transaksi Gagal",
      text: isSaldoError
        ? "Ada Kendala di Provider, hubungi admin (404 SAL)"
        : "Ada Kendala di Provider, hubungi admin (500 PRVDR)",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};


  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(options.length / itemsPerPage);
  const paginated = options.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= UI ================= */
  return (
    <div className="max-w-md mx-auto mt-6">
      <Link href="/ecommerce">
        <button className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg">
          ← Kembali ke AGPAY
        </button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6 px-4">
        <div>
          <label className="text-sm font-medium">No Meter PLN</label>
          <input
            value={meter}
            onChange={(e) => setMeter(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Nomor Telepon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Pilih Nominal Token</label>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {paginated.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCode(item.id);
                  setSelectedPrice(item.price);
                  setVoucherError(null);
                  setOriginalPrice(null);
                  setFinalPrice(null);
                }}
                className={clsx(
                  "cursor-pointer p-4 border rounded-xl text-center",
                  selectedCode === item.id
                    ? "border-[#009788] bg-[#009788]/10 font-semibold"
                    : "border-slate-200"
                )}
              >
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Kode Voucher</label>
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            onBlur={validateVoucher}
            className="w-full mt-2 px-4 py-3 border rounded-lg"
            placeholder="Optional"
          />
          {voucherError && (
            <p className="text-sm text-red-600 mt-1">{voucherError}</p>
          )}
        </div>

        <div className="border rounded-xl p-4 bg-[#009788]/10">
          <p className="text-sm">Saldo AGPAY</p>
          <p className="text-xl font-bold text-[#009788]">
            {formatRupiah(saldo)}
          </p>
          {total > saldo && (
            <p className="text-sm text-red-600 mt-2">Saldo tidak mencukupi</p>
          )}
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>

        <button
          type="submit"
          disabled={loading || total > saldo || !selectedCode || !meter || !phone}
          className={clsx(
            "w-full py-3 rounded-lg",
            loading || total > saldo || !selectedCode
              ? "bg-gray-400"
              : "bg-[#009788] text-white"
          )}
        >
          {loading ? "Memproses..." : "Beli Token PLN"}
        </button>
      </form>
    </div>
  );
}
