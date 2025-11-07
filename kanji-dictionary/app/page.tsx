import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Must await cookies() in Next.js 15+ because it is async
  const cookieStore = await cookies();

  // Create Supabase client using cookie methods
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-3">Welcome!</h1>
      <p className="mb-4">Signed in as: {user.email}</p>
      <p>Home is ready. You are signed in!</p>

      <br />
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
