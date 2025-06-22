import React from "react";
import type { ConnectionStatusProps } from "@/types";

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, error }) => {
  return (
    <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
      <p className="text-sm text-gray-600">
        Realtime:{" "}
        <span className={isConnected ? "text-green-600" : "text-red-600"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </p>
      {error && <p className="text-red-600 text-sm mt-2">Error: {error}</p>}
    </div>
  );
};

export default ConnectionStatus;
