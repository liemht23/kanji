"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/kanji");
        return;
      }

      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");

      if (access_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token ?? "",
        });

        if (error) {
          console.error("Error setting session:", error);
        } else {
          router.replace("/kanji");
        }
      } else {
        router.replace("/login");
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-lg">Đang xác thực tài khoản...</p>
    </main>
  );
};

export default AuthCallbackPage;
