// Sidebar.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import SidebarItem from "./Sidebar_element";
import { FileText, FolderKanban, Info, LayoutDashboard, MonitorCog, MonitorPlay } from "lucide-react";

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
        icon={<Info className="sidebar_icon" />}
        label="Personal info"
        isSelected={selectedTab === "Info"}
        onClick={() => setSelectedTab("Info")}
      />

      <SidebarItem
        icon={<MonitorPlay className="sidebar_icon" />}
        label="Social Media"
        isSelected={selectedTab === "Social"}
        onClick={() => setSelectedTab("Social")}
      />

      <SidebarItem
        icon={<FolderKanban className="sidebar_icon" />}
        label="Projects"
        isSelected={selectedTab === "Projects"}
        onClick={() => setSelectedTab("Projects")}
      />

      <SidebarItem
        icon={<MonitorCog className="sidebar_icon" />}
        label="Skills"
        isSelected={selectedTab === "Skills"}
        onClick={() => setSelectedTab("Skills")}
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
