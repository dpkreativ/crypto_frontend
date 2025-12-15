"use client";

import { AdminProvider } from "@/context/AdminContext";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminProvider>{children}</AdminProvider>
    </AdminGuard>
  );
}
