import React from "react";
import StatCard from "./StatCard";
import type { OverviewStatsProps } from "@/types";

const OverviewStats: React.FC<OverviewStatsProps> = ({ 
  viewersData, 
  sessionData, 
  loadData, 
  ScrollData,
  isConnected 
}) => {
  const { count: viewerCount, error: viewerError } = viewersData;
  const { avgSessionDuration, error: sessionError } = sessionData;
  const { avgPageLoadTime, error: loadError, loading: loadLoading } = loadData;
  const { avgScrollDepth, error: scrollError } = ScrollData;

  const statsData = [
    {
      title: "👀 Total Views",
      amount: viewerError ? "Error" : viewerCount?.toLocaleString() ?? "Loading...",
      subtitle: viewerError || (isConnected ? "Live" : "Connecting..."),
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white",
      showIndicator: true,
    },
    {
      title: "⏱️ Average Session Time",
      amount: sessionError ? (
        <p style={{ color: "red" }}>Error</p>
      ) : avgSessionDuration !== null ? (
        <p>{Math.round(avgSessionDuration)} minutes</p>
      ) : (
        <p>Loading...</p>
      ),
      subtitle: sessionError || "",
      bgColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      textColor: "text-white",
      showIndicator: false,
    },
    {
      title: "⬇️ Average Scroll Depth",
      amount: scrollError ? (
        <p style={{ color: "red" }}>Error</p>
      ) : avgScrollDepth !== null ? (
        `${avgScrollDepth}%`
      ) : (
        <p>Loading...</p>
      ),
      subtitle: scrollError || "",
      bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-500",
      textColor: "text-white",
      showIndicator: false,
    },
    {
      title: "⌚ Average Page Load Time",
      amount: loadError ? (
        <p style={{ color: "red" }}>Error</p>
      ) : loadLoading ? (
        <p>Loading...</p>
      ) : avgPageLoadTime !== null ? (
        `${avgPageLoadTime} ms`
      ) : (
        <p>No data</p>
      ),
      subtitle: loadError || "",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white",
      showIndicator: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 w-full max-w-none pr-5">
      {statsData.map((stat, i) => (
      <StatCard
        key={i}
        title={stat.title}
        amount={stat.amount}
        subtitle={stat.subtitle}
        bgColor={stat.bgColor}
        textColor={stat.textColor}
        showIndicator={stat.showIndicator}
        isConnected={isConnected}
      />
      ))}
    </div>
  );
};

export default OverviewStats;