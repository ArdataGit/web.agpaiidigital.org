"use client";

import Modal from "@/components/modal/modal";
import TopBar from "@/components/nav/topbar";
import { useAuth } from "@/utils/context/auth_context";
import { useModal } from "@/utils/hooks/use_modal";
import {
  UserIcon,
  MapPinIcon,
  AcademicCapIcon,
  CameraIcon,
  LockClosedIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import {
  isInformationProfileCompleted,
  isLocationProfileCompleted,
  isPnsStatusCompleted,
} from "@/utils/function/function";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function EditProfile() {
  const queryClient = useQueryClient();
  const { auth, authLoading } = useAuth();
  const router = useRouter();
  const { show, toggle } = useModal();

  if (authLoading || !auth) return null;

  /* ===============================
     PROFILE COMPLETION STATUS
  =============================== */

  const completionStatus = {
    information: isInformationProfileCompleted(auth),
    region: isLocationProfileCompleted(auth),
    status: isPnsStatusCompleted(auth),
  };

  const totalSection = 3;
  const completedSection =
    Number(completionStatus.information) +
    Number(completionStatus.region) +
    Number(completionStatus.status);

  const completionPercent = Math.round(
    (completedSection / totalSection) * 100
  );

  /* ===============================
     MENU CONFIG
  =============================== */

  const menuList: {
    label: string;
    link: string;
    icon: ReactNode;
    completed?: boolean;
  }[] = [
    {
      label: "Informasi Umum",
      link: "edit/information",
      icon: <UserIcon className="size-6" />,
      completed: completionStatus.information,
    },
    {
      label: "Provinsi / Kota",
      link: "edit/region",
      icon: <MapPinIcon className="size-6" />,
      completed: completionStatus.region,
    },
    {
      label: "Status Guru",
      link: "edit/status",
      icon: <AcademicCapIcon className="size-6" />,
      completed: completionStatus.status,
    },
    {
      label: "Profile Sosmed",
      link: "edit/social-media",
      icon: <CameraIcon className="size-6" />,
    },
    {
      label: "Ubah Password",
      link: "edit/password",
      icon: <LockClosedIcon className="size-6" />,
    },
  ];

  /* ===============================
     LOGOUT
  =============================== */

  const logout = async () => {
    localStorage.removeItem("access_token");
    await queryClient
      .invalidateQueries({ queryKey: ["auth"] })
      .then(() => router.push("/auth/login"));
  };

  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      {/* Logout Modal */}
      <Modal show={show} onClose={toggle} className="w-[20rem]">
        <div className="mt-8">
          <h1 className="mb-8 text-left text-sm text-slate-600">
            Apakah anda yakin ingin log out?
          </h1>
          <div className="flex gap-2 justify-end">
            <button
              onClick={toggle}
              className="bg-slate-300 px-3 py-1.5 rounded-md"
            >
              Batal
            </button>
            <button
              onClick={logout}
              className="bg-[#009788] px-4 py-1.5 rounded-md text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>

      <div className="pt-[4.21rem]">
        <TopBar withBackButton href="/">
          Edit Profile
        </TopBar>

        <div className="flex flex-col px-[5%] sm:px-6 gap-4 mt-4">

          {/* HEADER */}
          <div>
            <div className="text-2xl font-semibold text-[#009788]">
              Edit Profile
            </div>
            <p className="text-sm text-slate-500">
              Lengkapi data anda untuk mengaktifkan semua fitur
            </p>
          </div>

          {/* PROGRESS BAR */}
          {/* <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-600">
                Kelengkapan Profil
              </span>
              <span className="font-semibold text-[#009788]">
                {completionPercent}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-[#009788] h-2 rounded-full transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div> */}

          {/* MENU LIST */}
          {menuList.map((menu, i) => (
            <Link
              href={menu.link}
              key={i}
              className={`flex items-center px-5 py-3 rounded-lg border shadow-sm transition
                ${
                  menu.completed === false
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-white"
                }
              `}
            >
              <div className="text-[#009788]">{menu.icon}</div>

              <div className="ml-3 flex-1">
                <h1 className="text-slate-700 text-sm font-medium">
                  {menu.label}
                </h1>

                {menu.completed === false && (
                  <p className="text-xs text-red-500">
                    Data belum lengkap
                  </p>
                )}

                {menu.completed === true && (
                  <p className="text-xs text-green-600">
                    Data sudah lengkap
                  </p>
                )}
              </div>

              {menu.completed === true && (
                <CheckCircleIcon className="size-5 text-green-500" />
              )}

              {menu.completed === false && (
                <ExclamationCircleIcon className="size-5 text-red-500" />
              )}
            </Link>
          ))}

          {/* ADMIN ONLY */}
          {auth.role_id == 1 && (
            <Link
              href={"/edit-user"}
              className="flex items-center px-5 py-3 rounded-lg border shadow-sm bg-white"
            >
              <UserIcon className="size-6 text-[#009788]" />
              <h1 className="ml-3 text-slate-700 text-sm font-medium">
                Edit User
              </h1>
            </Link>
          )}

          {/* LOGOUT */}
          <div
            onClick={toggle}
            className="flex items-center px-5 py-3 rounded-lg border shadow-sm bg-white mt-10 cursor-pointer"
          >
            <h1 className="text-slate-700 text-sm font-medium">
              Logout
            </h1>
            <ArrowLeftStartOnRectangleIcon className="size-6 text-[#009788] ml-auto" />
          </div>
        </div>
      </div>
    </>
  );
}