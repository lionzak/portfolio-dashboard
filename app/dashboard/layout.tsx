"use client";

import Sidebar from "@/components/ui/Sidebar";
import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="font-work-sans flex justify-between items-items">
        <Sidebar />
        <main className="w-full h-full mt-10">{children}</main>
      </main>
    </SidebarProvider>
  );
}
