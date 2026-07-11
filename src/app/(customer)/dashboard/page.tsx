import { redirect } from "next/navigation";
import { MarketTopBar } from "@/components/layout/MarketTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-market-bg pb-16 md:pb-8">
      <MarketTopBar />

      <section className="max-w-6xl mx-auto px-2 md:px-6 py-4">
        <div className="bg-market-card rounded-md p-4 flex items-center justify-between">
          <div>
            <p className="text-market-text font-medium">{profile?.full_name ?? user.email}</p>
            <p className="text-market-text-secondary text-xs mt-0.5">
              {user.email} · {profile?.role === "supplier" ? "Supplier account" : "Buyer account"}
            </p>
          </div>
          <LogoutButton />
        </div>

        {profile?.role === "supplier" && (
          <div className="bg-market-card rounded-md p-4 mt-2">
            <p className="text-market-text text-sm font-medium">Supplier tools</p>
            <p className="text-market-text-secondary text-xs mt-1">
              Product upload, orders, and wallet are coming next — your
              supplier record was created automatically and is pending
              verification.
            </p>
          </div>
        )}

        {profile?.role !== "supplier" && (
          <div className="bg-market-card rounded-md p-4 mt-2">
            <p className="text-market-text text-sm font-medium">Orders</p>
            <p className="text-market-text-secondary text-xs mt-1">
              Order history and tracking are coming next.
            </p>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
