"use client";

import React from "react";
import { useUser } from "@/components/UserProvider";
import { useViewersData } from "@/hooks/useViewersData";
import { useDevicesData } from "@/hooks/useDevicesData";
import { useSessionData } from "@/hooks/useSessionData";
import ConnectionStatus from "@/components/ui/ConnectionStatus";
import OverviewStats from "@/components/ui/overview_stats";
import BrowserBarChart from "./browser_bar_char";
import { useScrollDepthData } from "@/hooks/useScrollDepthData";
import DeviceBarChart from "./device_bar_graph";
import { useAveragePageLoadTime } from "@/hooks/useAveragePageLoadTime";

const Overview_page: React.FC = () => {
  const { user } = useUser();

  const viewersData = useViewersData(user);
  const devicesData = useDevicesData(user);
  const sessionData = useSessionData(user);
  const scrollData = useScrollDepthData(user);
  const loadData = useAveragePageLoadTime();

  const mainError = viewersData.error || devicesData.error || sessionData.error;

  return (
    <div className="pl-6 bg-gray-50">
      <ConnectionStatus
        isConnected={viewersData.isConnected}
        error={mainError}
      />

      <OverviewStats
        viewersData={viewersData}
        sessionData={sessionData}
        ScrollData={scrollData}
        loadData={loadData}
        isConnected={viewersData.isConnected}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pr-6">
        <div className="w-full">
          <BrowserBarChart />
        </div>
        <div className="w-full">
          <DeviceBarChart devicesData={devicesData} />
        </div>
      </div>
    </div>
  );
};

export default Overview_page;
