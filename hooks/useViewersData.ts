
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, ViewersData, ViewerRecord } from "@/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const useViewersData = (user: User | null): ViewersData => {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!user) {
      setCount(null);
      setError(null);
      setIsConnected(false);
      return;
    }

    const setupViewersData = async (): Promise<void> => {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      try {
        // Fetch initial data
        const { data, error } = await supabase
          .from("viewers")
          .select("count")
          .eq("id", 1)
          .single();

        if (error) {
          setError("Failed to fetch viewer count");
          return;
        }

        const viewerData = data as ViewerRecord;
        setCount(viewerData.count);

        // Setup realtime subscription
        const channelName = `viewers-${user.id}-${Date.now()}`;
        channelRef.current = supabase.channel(channelName);

        channelRef.current.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "viewers",
            filter: "id=eq.1",
          },
          (payload: { new: ViewerRecord }) => {
            setCount(payload.new.count);
          }
        );

        if (!isSubscribedRef.current) {
          isSubscribedRef.current = true;
          channelRef.current.subscribe((status: string) => {
            setIsConnected(status === "SUBSCRIBED");
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      }
    };

    setupViewersData();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [user?.id]);

  return { count, error, isConnected };
};