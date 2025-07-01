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
    <div className="p-4 sm:p-6 lg:pl-6 lg:pr-0 bg-gray-50 min-h-screen max-h-screen overflow-y-auto flex flex-col ">
      <div className="max-w-7xl mx-auto lg:mx-0 pb-8 flex-1 min-h-0">
        <ConnectionStatus
          isConnected={viewersData.isConnected}
          error={mainError}
        />

        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <OverviewStats
            viewersData={viewersData}
            sessionData={sessionData}
            ScrollData={scrollData}
            loadData={loadData}
            isConnected={viewersData.isConnected}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:pr-6 flex-1 min-h-0">
          <div className="w-full bg-white rounded-lg shadow-sm border p-4 sm:p-2">
            <BrowserBarChart />
          </div>
          <div className="w-full bg-white rounded-lg shadow-sm border p-4 sm:p-2">
            <DeviceBarChart devicesData={devicesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview_page;