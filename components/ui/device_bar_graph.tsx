"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { DevicesData } from "@/types";

// Define bar colors per device
const deviceColors: { [key: string]: string } = {
  mobile: "#3B82F6",  // Blue
  desktop: "#10B981", // Green
  tablet: "#F59E0B",  // Amber
};

export default function DeviceBarChart({ devicesData }: { devicesData: DevicesData }) {
  const { deviceCounts, error } = devicesData;

  const data = [
    { device: "mobile", count: deviceCounts.mobile },
    { device: "tablet", count: deviceCounts.tablet },
    { device: "desktop", count: deviceCounts.desktop },
  ];

  return (
    <div className="bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-center text-lg font-semibold mt-2">Device Usage</h2>

      {error ? (
        <p className="text-red-500 text-center py-4">Error: {error}</p>
      ) : (
        <div className="bg-gray-100 p-2 rounded-b-lg">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="device" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" barSize={28}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={deviceColors[entry.device] || "#D1D5DB"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
