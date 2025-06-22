import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, SessionData } from "@/types";

export const useSessionData = (user: User | null): SessionData => {
  const [avgSessionDuration, setAvgSessionDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAvgSessionDuration(null);
      setError(null);
      return;
    }

    const fetchSessionData = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.rpc("get_avg_session_duration");

        if (error) {
          setError("Failed to fetch session data");
          return;
        }

        setAvgSessionDuration((data as number) / 60);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      }
    };

    fetchSessionData();
  }, [user?.id]);

  return { avgSessionDuration, error };
};
