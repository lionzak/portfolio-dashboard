import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, DevicesData, DeviceCounts, DeviceRecord } from "@/types";

export const useDevicesData = (user: User | null): DevicesData => {
  const [deviceCounts, setDeviceCounts] = useState<DeviceCounts>({
    mobile: 0,
    desktop: 0,
    tablet: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      setDeviceCounts({ mobile: 0, desktop: 0, tablet: 0 });
      setError(null);
      return;
    }

    const setupDevicesData = async (): Promise<void> => {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      try {
        // Fetch initial data
        const { data, error } = await supabase
          .from("devices")
          .select("device_type, count");

        if (error) {
          setError("Failed to fetch device counts");
          return;
        }

        const deviceData = data as DeviceRecord[];
        const counts: DeviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
        
        deviceData.forEach((row) => {
          const type = row.device_type.toLowerCase() as keyof DeviceCounts;
          if (type in counts) {
            counts[type] = row.count;
          }
        });
        setDeviceCounts(counts);

        // Setup realtime subscription
        const channelName = `devices-${user.id}-${Date.now()}`;
        channelRef.current = supabase.channel(channelName);

        channelRef.current.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "devices",
          },
          (payload: { new: DeviceRecord }) => {
            const updated = payload.new;
            const type = updated.device_type.toLowerCase() as keyof DeviceCounts;
            setDeviceCounts((prev) => ({
              ...prev,
              [type]: updated.count,
            }));
          }
        );

        channelRef.current.subscribe();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      }
    };

    setupDevicesData();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  return { deviceCounts, error };
};
