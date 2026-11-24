import { createClient } from "@/lib/supabase/server";

export type AppProfileSummary = {
  name: string;
  email: string | null;
};

export async function getAppProfileSummary(): Promise<AppProfileSummary> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { name: "ECOLOGIX guest", email: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    return {
      name: profile?.full_name?.trim() || "ECOLOGIX member",
      email: user.email ?? null,
    };
  } catch {
    return { name: "ECOLOGIX guest", email: null };
  }
}
