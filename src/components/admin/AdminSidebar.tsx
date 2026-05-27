// src/components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Settings,
  LogOut,
  Box,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: <Home size={20} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={20} /> },
  { href: "/admin/products", label: "Products", icon: <Box size={20} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        onClick={toggle}
        className="admin-hamburger absolute top-4 left-4 z-20 md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="admin-overlay fixed inset-0 bg-black/30 md:hidden"
          onClick={toggle}
        />
      )}

      <nav
        className={`admin-sidebar bg-gradient-to-b from-indigo-800 to-indigo-900 text-white p-4 md:static fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-semibold">Admin</h2>
          <button onClick={toggle} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-2 rounded hover:bg-indigo-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                // Sign out via next-auth client API
                // Imported lazily to avoid SSR issues
                import("next-auth/react").then(({ signOut }) => signOut());
              }}
              className="flex items-center gap-3 p-2 rounded hover:bg-indigo-700 transition-colors w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
