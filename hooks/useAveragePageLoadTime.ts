import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useAveragePageLoadTime = () => {
  const [avgPageLoadTime, setAvgPageLoadTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAverage = async () => {
      setLoading(true);
      setError(null); // Reset error state
      
      try {
        const { data, error: supabaseError } = await supabase.rpc("get_avg_page_load");

        if (supabaseError) {
          console.error("Failed to fetch average page load time:", supabaseError.message);
          setError("Failed to load page load time data");
          setAvgPageLoadTime(null);
        } else if (data === null || data === undefined) {
          // Handle empty table case
          setError("No page load time data available");
          setAvgPageLoadTime(null);
        } else {
          setAvgPageLoadTime(data);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        setAvgPageLoadTime(null);
      }

      setLoading(false);
    };

    fetchAverage();
  }, []);

  return { avgPageLoadTime, loading, error };
};
