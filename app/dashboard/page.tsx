"use client";

import { useUser } from "@/components/UserProvider";
import { useSidebar } from "@/context/SidebarContext";
import Overview_page from "@/components/ui/Overview_page";
import { useRouter } from "next/navigation";
import Form_page from "@/components/ui/Form_page";
import { useEffect } from "react";
import SocialMediaPage from "@/components/ui/social_media_page";
import PersonaInfoPage from "@/components/ui/personal_info_page";
import SkillsPage from "@/components/ui/SkillsPage";
import ProjectsPage from "@/components/ui/ProjectsPage";

export default function Dashboard() {
  const { selectedTab } = useSidebar();
  const router = useRouter();
  const { user } = useUser();

  // Move the redirect logic to useEffect
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Show loading or return null while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center h-full overflow-auto">
      {selectedTab === "Overview" && <Overview_page />}
      {selectedTab === "Form" && <Form_page />}
      {selectedTab === "Social" && <SocialMediaPage />}
      {selectedTab === "Info" && <PersonaInfoPage />}
      {selectedTab === "Skills" && <SkillsPage/>}
      {selectedTab === "Projects" && <ProjectsPage/>}
    </div>
  );
}