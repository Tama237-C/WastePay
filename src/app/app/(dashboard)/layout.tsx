import { MobileAppShell } from "@/components/app/mobile-app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let name: string | null = null;
  let role: "agent" | "collector" | "driver" | "manager" | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    name = profile?.full_name ?? null;
    role = profile?.role === "agent" || profile?.role === "collector" || profile?.role === "driver" || profile?.role === "manager" ? profile.role : null;
  }

  return <MobileAppShell role={role} name={name}>{children}</MobileAppShell>;
}
