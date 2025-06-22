import React from "react";
import type { StatCardProps } from "@/types";

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  amount, 
  subtitle, 
  bgColor, 
  textColor, 
  showIndicator, 
  isConnected = false 
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-medium opacity-90 mb-2">{title}</h3>
          <div className="text-3xl md:text-4xl font-bold mb-3">{amount}</div>
        </div>
        <div className="text-sm font-medium opacity-80">{subtitle}</div>
      </div>
      {showIndicator && (
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
          }`}
        />
      )}
    </div>
  );
};

export default StatCard;
  