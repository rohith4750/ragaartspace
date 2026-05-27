// src/app/admin/layout.tsx
import Head from "next/head";
"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import "@/app/admin/globals.css"; // ensure any admin‑specific styles are loaded

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <QueryProvider>
          <div className="flex min-h-screen bg-background text-foreground">
            {/* AdminSidebar removed */}
            <main className="flex-1 overflow-y-auto p-6 md:ml-64">
              {children}
            </main>
          </div>
        </QueryProvider>
      </AuthProvider>
    </>
  );
}
