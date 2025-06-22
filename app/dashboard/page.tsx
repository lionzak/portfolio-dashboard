"use client";

import React, { useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Loader2 } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import Overview_page from "@/components/ui/Overview_page";

export default function Dashboard() {
  const { selectedTab, setSelectedTab } = useSidebar();

  const { user } = useUser();

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );

  return (
    <div className="text-center">
      {selectedTab === "Overview" && <Overview_page />}
      {selectedTab === "Form" && <>form</>}
    </div>
  );
}
