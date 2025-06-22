"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginPage from "./login/page";
import Dashboard from "@/app/dashboard/page";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    // Optional: track auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user) {
      router.push("/dashboard");
    }
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );
}
