"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios-config";
import { toast } from "react-toastify";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/log-in"); // Or /login depending on your route
        return;
      }

      try {
        const res = await apiClient.get("/api/auth/get_users");
        // Assuming response structure: { user: { role: 'admin', ... } } based on UserInfo.tsx usage
        // We'll log it to be sure during dev
        console.log("AdminGuard check:", res.data);

        const user = res.data.user || res.data;
        // Adapting to potential structures. UserInfo uses user?.user?.name.

        if (user && user.role === "admin") {
          setAuthorized(true);
        } else {
          toast.error("Access denied. Admin rights required.");
          router.push("/home");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        router.push("/log-in");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-dark-background tw-text-white">
        Loading admin access...
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
