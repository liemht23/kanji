"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useLayout } from "@/app/context/LayoutContext";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";

const KanjiPage = () => {
  const { isMobile } = useLayout();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className={isMobile ? "p-4" : "px-10 py-8"}>
      <KanjiToolBar />
      <KanjiCard />
    </div>
  );
};

export default KanjiPage;