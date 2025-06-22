// components/ui/SidebarItem.tsx
"use client";

import React from "react";

interface SidebarItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactElement;
}

export default function SidebarItem({
  label,
  isSelected,
  onClick,
  icon,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-2 cursor-pointer rounded-md transition-colors flex  items-center mb-2 ${
        isSelected
          ? "bg-gray-200 border-l-4 border-blue-500"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
