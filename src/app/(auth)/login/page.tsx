"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-market-bg flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-market-card rounded-md p-6 max-w-sm w-full"
      >
        <h1 className="font-display text-market-text text-xl font-medium mb-1">Log in</h1>
        <p className="text-market-text-secondary text-sm mb-6">
          Welcome back to Viarnex Mall.
        </p>

        <label className="block text-xs text-market-text-secondary mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-market-border rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-market-orange"
        />

        <label className="block text-xs text-market-text-secondary mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-market-border rounded-md px-3 py-2 text-sm mb-5 outline-none focus:border-market-orange"
        />

        {error && <p className="text-market-price text-xs mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-market-orange text-white font-medium rounded-md py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="text-market-text-secondary text-xs text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-market-orange font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
