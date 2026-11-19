import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WorkspaceGateway } from "@/components/app/workspace-gateway";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "WastePay Staff Access",
  description: "Choose your secure WastePay staff workspace.",
};

const dashboardPaths: Record<string, string> = {
  admin: "/admin/overview",
  manager: "/app/manager",
  agent: "/app/agent",
  driver: "/app/driver",
  collector: "/app/collector",
};

export default async function AppWorkspacesPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("WastePay could not verify the current staff sign-in.", {
      cause: userError,
    });
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active, must_change_password")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error("WastePay could not load the staff workspace.", {
        cause: profileError,
      });
    }

    const dashboardPath = profile ? dashboardPaths[profile.role] : undefined;

    if (dashboardPath && profile?.is_active) {
      if (profile.must_change_password) {
        redirect("/app/change-password");
      }

      redirect(dashboardPath);
    }
  }

  return <WorkspaceGateway />;
}
