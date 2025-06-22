// context/SidebarContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");

  return (
    <SidebarContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
