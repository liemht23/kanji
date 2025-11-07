"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function HomePage() {
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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-3">Welcome!</h1>
      {user && <p className="mb-4">Signed in as: {user.email}</p>}
      <p>Home is ready. You are signed in!</p>
      <br />
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign out
      </button>
    </main>
  );
}