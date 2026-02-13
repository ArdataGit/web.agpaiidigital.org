"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";

const API_BASE = "https://admin.agpaiidigital.org";

type Soal = {
  id: number;
  pertanyaan: string;
  opsi: Record<string, string>;
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const latihanId = params.id as string;

  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState<Record<number, string>>({});
  const [durasi, setDurasi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // MODAL STATE
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const currentSoal = soalList[currentIndex];

  /* FETCH SOAL */
  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cbt/latihan/${latihanId}`);
        const json = await res.json();

        if (json.success) {
          setSoalList(json.soal || []);
          setDurasi((json.durasi || 0) * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (latihanId) fetchSoal();
  }, [latihanId]);

  /* TIMER */
  useEffect(() => {
    if (durasi <= 0) return;

    const interval = setInterval(() => {
      setDurasi((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSelesai();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durasi]);

  const formatTime = () => {
    const m = Math.floor(durasi / 60);
    const s = durasi % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  /* SIMPAN JAWABAN */
  const simpanJawaban = async () => {
    if (!currentSoal) return;

    await fetch(`${API_BASE}/api/cbt/latihan/${latihanId}/jawab`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        soal_id: currentSoal.id,
        jawaban: jawaban[currentSoal.id] || "",
      }),
    });
  };

  const handleNext = async () => {
    await simpanJawaban();
    if (currentIndex < soalList.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  /* SELESAI */
  const handleSelesai = async () => {
    try {
      setSubmitting(true);
      await simpanJawaban();

      const res = await fetch(
        `${API_BASE}/api/cbt/latihan/${latihanId}/selesai`,
        { method: "POST" },
      );

      const json = await res.json();

      if (json.success) {
        router.push(`/cbt/result/${latihanId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat soal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-teal-700 text-white px-4 py-4 flex justify-between items-center">
        <button onClick={() => setShowExitModal(true)}>←</button>
        <span className="font-semibold">Latihan Soal</span>
        <div />
      </div>

      {/* TIMER */}
      <div className="flex justify-center mt-4">
        <div className="bg-orange-400 text-white px-6 py-2 rounded-full font-semibold">
          {formatTime()}
        </div>
      </div>

      {/* NOMOR SOAL */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow p-3 flex gap-2 overflow-x-auto">
          {soalList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={clsx(
                "w-10 h-10 rounded-lg text-sm font-semibold",
                i === currentIndex
                  ? "bg-teal-700 text-white"
                  : jawaban[soalList[i].id]
                    ? "bg-teal-200"
                    : "bg-gray-200",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* SOAL */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <div
            dangerouslySetInnerHTML={{
              __html: currentSoal?.pertanyaan || "",
            }}
          />

          <div className="mt-6 space-y-3">
            {Object.entries(currentSoal?.opsi || {}).map(
              ([key, value]) =>
                value && (
                  <label
                    key={key}
                    className={clsx(
                      "flex items-center p-4 border rounded-xl cursor-pointer",
                      jawaban[currentSoal.id] === key
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200",
                    )}
                  >
                    <input
                      type="radio"
                      name={`soal-${currentSoal.id}`}
                      value={key}
                      checked={jawaban[currentSoal.id] === key}
                      onChange={(e) =>
                        setJawaban({
                          ...jawaban,
                          [currentSoal.id]: e.target.value,
                        })
                      }
                      className="mr-3"
                    />
                    <span>
                      <strong>{key}.</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: value }} />
                    </span>
                  </label>
                ),
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="px-4 mt-6 pb-10">
        <div className="flex justify-between items-center">
          <button onClick={handlePrev}>◀</button>
          <div>
            {currentIndex + 1}/{soalList.length}
          </div>
          <button onClick={handleNext}>▶</button>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          disabled={submitting}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl"
        >
          {submitting ? "Memproses..." : "Submit"}
        </button>
      </div>

      {/* ================= MODAL KELUAR ================= */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm text-center">
            <h3 className="text-lg font-bold mb-3">Keluar dari Pengerjaan?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Waktu pengerjaan tetap berjalan. Kamu bisa melanjutkan selama
              waktu masih tersedia.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl"
              >
                Keluar
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUBMIT ================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm text-center">
            <h3 className="text-lg font-bold mb-3">
              {Object.keys(jawaban).length}/{soalList.length} Soal terisi
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Periksa kembali jawaban sebelum mengirim.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSelesai();
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl"
              >
                Submit
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
