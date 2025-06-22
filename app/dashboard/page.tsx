"use client";

import { useUser } from "@/components/UserProvider";
import { useSidebar } from "@/context/SidebarContext";
import Overview_page from "@/components/ui/Overview_page";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { selectedTab} = useSidebar();
  const router = useRouter()

  const { user } = useUser();

  if (!user)
    return (
      router.push("/login")
    );

  return (
    <div className="text-center">
      {selectedTab === "Overview" && <Overview_page />}
      {selectedTab === "Form" && <>form</>}
    </div>
  );
}
