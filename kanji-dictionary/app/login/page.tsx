"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (result.error) {
        setError(result.error.message || "Failed to sign in");
        setLoading(false);
        return;
      }
      // Redirect to /kanji after successful login
      router.push("/kanji");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </label>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogle}
            className="w-full mt-2 border border-gray-300 bg-white hover:bg-gray-100 py-2 rounded flex items-center justify-center gap-3 shadow-sm transition disabled:opacity-60"
            disabled={loading}
            style={{ minHeight: 44 }}
            aria-label="Sign in with Google"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className=""
              aria-hidden="true"
            >
              <g>
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.7 1.22 9.2 3.23l6.9-6.9C35.6 2.1 30.2 0 24 0 14.8 0 6.7 5.1 2.7 12.5l8.1 6.3C12.7 13.1 17.9 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.7-2.1 5-4.4 6.6l7 5.4c4.1-3.8 6.5-9.4 6.5-16.4z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.8 28.8c-1.1-3.2-1.1-6.7 0-9.9l-8.1-6.3C.6 16.6 0 20.2 0 24c0 3.8.6 7.4 2.7 10.4l8.1-6.3z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.2 0 11.4-2 15.2-5.5l-7-5.4c-2 1.4-4.6 2.2-8.2 2.2-6.1 0-11.3-4.1-13.2-9.6l-8.1 6.3C6.7 42.9 14.8 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
            <span className="font-medium text-gray-700 text-base">
              {loading ? "Please wait..." : "Sign in with Google"}
            </span>
          </button>
        </div>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
