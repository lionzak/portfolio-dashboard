"use client";

import Sidebar from "@/components/ui/Sidebar";
import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="font-work-sans h-screen flex">
        <Sidebar />
        <main className="flex-1 h-full overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}