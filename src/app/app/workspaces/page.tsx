import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WorkspaceGateway } from "@/components/app/workspace-gateway";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "ECOLOGIX Staff Access",
  description: "Choose your secure ECOLOGIX staff workspace.",
};

const dashboardPaths: Record<string, string> = {
  admin: "/admin/overview",
  manager: "/app/manager",
  agent: "/app/agent",
  driver: "/app/driver",
  collector: "/app/collector",
};

function WorkspaceSignInError({ code }: { code?: string }) {
  return (
    <main className="wp-auth-page">
      <div className="wp-auth-page__glow wp-auth-page__glow--one" />
      <div className="wp-auth-page__glow wp-auth-page__glow--two" />
      <section className="wp-auth-card">
        <header className="wp-auth-brand">
          <span className="wp-app-brand__mark">W</span>
          <span>ECOLOGIX</span>
          <em>Secure network</em>
        </header>
        <div className="wp-auth-intro">
          <p className="wp-overline">Staff access</p>
          <h1>We could not check your sign-in.</h1>
          <p role="alert">
            {code
              ? `The account service returned error ${code}. Refresh this page or sign in again.`
              : "The account service could not verify your sign-in. Refresh this page or sign in again."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/app/workspaces" className="wp-primary-button">
              Try again
            </Link>
            <Link href="/app/staff-login" className="wp-secondary-button">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AppWorkspacesPage() {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("ECOLOGIX could not load the staff session.", {
      code: sessionError.code,
      message: sessionError.message,
    });
    return <WorkspaceSignInError code={sessionError.code} />;
  }

  if (session) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("ECOLOGIX could not verify the staff sign-in.", {
        code: userError.code,
        message: userError.message,
      });
      return <WorkspaceSignInError code={userError.code} />;
    }

    if (!user) {
      return <WorkspaceGateway />;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active, must_change_password")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("ECOLOGIX could not load the staff workspace.", {
        code: profileError.code,
        message: profileError.message,
      });
      return <WorkspaceSignInError code={profileError.code} />;
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
