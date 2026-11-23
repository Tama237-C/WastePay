import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { createClient } from "@/lib/supabase/server";

type AdminDashboardLayoutProps = {
  children: ReactNode;
};

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/app/staff-login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/app/staff-login");
  }

  if (!profile.is_active || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  const administratorName =
    profile.full_name?.trim() || "ECOLOGIX Administrator";

  const administratorEmail =
    user.email?.trim() || "Administrator account";

  return (
    <AdminShell
      administratorName={administratorName}
      administratorEmail={administratorEmail}
    >
      {children}
    </AdminShell>
  );
}