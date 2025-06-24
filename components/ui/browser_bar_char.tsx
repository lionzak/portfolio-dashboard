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
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type BrowserStat = {
  browser: string;
  count: number;
};

const browserColors: { [key: string]: string } = {
  Chrome: "#FBBC04",   // Yellow
  Safari: "#006CFF",   // Blue
  Edge: "#50C878",     // Emerald
};

export default function BrowserBarChart() {
  const [data, setData] = useState<BrowserStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrowserData = async () => {
      const { data, error } = await supabase
        .from("browsers")
        .select("browser, count");

      if (error) {
        console.error("Failed to fetch browser data", error.message);
      } else {
        // Sort browsers in the order: Chrome, Safari, Edge
        const browserOrder = ["Chrome", "Safari", "Edge"];
        const sortedData = data
          .slice()
          .sort(
            (a: BrowserStat, b: BrowserStat) =>
              browserOrder.indexOf(a.browser) - browserOrder.indexOf(b.browser)
          );
        setData(sortedData);
      }

      setLoading(false);
    };

    fetchBrowserData();

  }, []);

  return (
    <div className="bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-center text-lg font-semibold mt-2">Browser Usage</h2>
      {loading ? (
        <p className="text-center text-gray-500 text-sm py-4">Loading...</p>
      ) : (
        <div className="bg-gray-100 p-2 rounded-b-lg">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              barCategoryGap={8}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="browser" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" barSize={28}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={browserColors[entry.browser] || "#D1D5DB"}
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
