// ✅ app/proxy.ts hoặc src/proxy.ts (tùy vị trí bạn đặt)
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();

  console.log("🧠 Proxy sees session:", !!data.session);

  // if (
  //   !data.session &&
  //   request.nextUrl.pathname.startsWith("/kanji") &&
  //   !request.nextUrl.pathname.startsWith("/auth") &&
  //   !request.nextUrl.pathname.startsWith("/login")
  // ) {
  //   const redirectUrl = new URL("/login", request.url);
  //   redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  return response;
}

// ⚙️ Cấu hình matcher (vẫn cần)
export const config = {
  matcher: ["/kanji/:path*"],
};
