import React from 'react';

export interface User {
  id: string;
  email?: string;
}

export interface ViewersData {
  count: number | null;
  error: string | null;
  isConnected: boolean;
}

export interface DeviceCounts {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface DevicesData {
  deviceCounts: DeviceCounts;
  error: string | null;
}

export interface SessionData {
  avgSessionDuration: number | null;
  error: string | null;
}

export interface ScrollData {
  avgScrollDepth: number | null;
  error: string | null;
}

export interface ViewerRecord {
  id: number;
  count: number;
}

export interface DeviceRecord {
  device_type: string;
  count: number;
}

export interface StatCardProps {
  title: string;
  amount: string | number | React.ReactNode;
  subtitle: string;
  bgColor: string;
  textColor: string;
  showIndicator: boolean;
  isConnected?: boolean;
}

export interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export interface LoadData {
  avgPageLoadTime: number | null;
  error: string | null;
  loading: boolean;
}

export interface OverviewStatsProps {
  viewersData: ViewersData;
  sessionData: SessionData;
  loadData: LoadData;
  ScrollData: ScrollData;
  isConnected: boolean;
}
