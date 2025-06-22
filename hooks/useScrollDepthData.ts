import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types";

interface ScrollDepthData {
  avgScrollDepth: number | null;
  error: string | null;
}

export const useScrollDepthData = (user: User | null): ScrollDepthData => {
  const [avgScrollDepth, setAvgScrollDepth] = useState<number | null>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchScrollDepthData = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.rpc("get_avg_scroll_depth");

      if (error) {
        console.error("RPC Error:", error.message);
      } else if (data === null) {
        console.warn("No data returned from RPC — possible reasons:");
        console.warn("- Table is empty");
        console.warn("- RLS is blocking read access");
        console.warn("- Function isn't returning a value");
      } else {
        console.log("Average scroll depth:", data);
      }

      if (error) {
        setError("Failed to fetch scroll depth data");
        return;
      }

      setAvgScrollDepth(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (!user) {
      setAvgScrollDepth(null);
      setError(null);
      return;
    }

    fetchScrollDepthData();
  }, [user?.id]);

  return { avgScrollDepth, error };
};
