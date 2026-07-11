"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "supplier">("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Read by the handle_new_user() trigger to set profiles.role/full_name.
        data: { role, full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required, there's no session yet.
    if (data.user && !data.session) {
      setConfirmSent(true);
      return;
    }

    router.push(role === "supplier" ? "/dashboard" : "/products");
    router.refresh();
  }

  if (confirmSent) {
    return (
      <main className="min-h-screen bg-market-bg flex items-center justify-center px-4">
        <div className="bg-market-card rounded-md p-6 max-w-sm w-full text-center">
          <p className="text-market-text font-medium">Check your email</p>
          <p className="text-market-text-secondary text-sm mt-2">
            We sent a confirmation link to {email}. Click it to activate your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-market-bg flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-market-card rounded-md p-6 max-w-sm w-full"
      >
        <h1 className="font-display text-market-text text-xl font-medium mb-1">
          Create your account
        </h1>
        <p className="text-market-text-secondary text-sm mb-6">
          Buy factory-direct, or sell as a verified supplier.
        </p>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              role === "customer"
                ? "bg-market-orange text-white"
                : "bg-market-orange-soft text-market-orange"
            }`}
          >
            I'm a buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("supplier")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              role === "supplier"
                ? "bg-market-orange text-white"
                : "bg-market-orange-soft text-market-orange"
            }`}
          >
            I'm a supplier
          </button>
        </div>

        <label className="block text-xs text-market-text-secondary mb-1">Full name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-market-border rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-market-orange"
        />

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
          minLength={6}
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
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-market-text-secondary text-xs text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-market-orange font-medium">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
