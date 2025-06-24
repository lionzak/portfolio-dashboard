// Sidebar.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import SidebarItem from "./Sidebar_element";
import { FileText, LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  const { selectedTab, setSelectedTab } = useSidebar();

  return (
    <div className="w-[300px] border-r min-h-screen p-4 max-sm:w-[150px] overflow-y-auto max-h-screen">
      <SidebarItem
        icon={<LayoutDashboard className="sidebar_icon" />}
        label="Overview"
        isSelected={selectedTab === "Overview"}
        onClick={() => setSelectedTab("Overview")}
      />
      <SidebarItem
        icon={<FileText className="sidebar_icon" />}
        label="Form"
        isSelected={selectedTab === "Form"}
        onClick={() => setSelectedTab("Form")}
      />
    </div>
  );
};

export default Sidebar;
