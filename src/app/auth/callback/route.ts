import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const flow = request.nextUrl.searchParams.get("flow");
  const isCustomerRecovery = flow === "customer";
  const isCustomerGoogleSignIn = flow === "customer_google";
  const recoveryRequestPath = isCustomerRecovery
    ? "/app/account/recovery"
    : "/app/password-recovery";

  if (!code) {
    return NextResponse.redirect(
      new URL(
        isCustomerGoogleSignIn ? "/app/account" : recoveryRequestPath,
        request.url,
      ),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("ECOLOGIX could not verify a password recovery link.", {
      code: error.code,
      message: error.message,
    });
    return NextResponse.redirect(
      new URL(
        isCustomerGoogleSignIn ? "/app/account" : recoveryRequestPath,
        request.url,
      ),
    );
  }

  if (isCustomerGoogleSignIn) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL("/app/account", request.url));
    }

    const adminClient = createAdminClient();
    const { data: existingProfile, error: profileLookupError } =
      await adminClient
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .maybeSingle();

    if (profileLookupError) {
      console.error("ECOLOGIX could not verify a Google account profile.", {
        code: profileLookupError.code,
        message: profileLookupError.message,
      });
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/app/account", request.url));
    }

    let profile = existingProfile;

    if (!profile) {
      const userMetadata = user.user_metadata ?? {};
      const metadataName =
        typeof userMetadata.full_name === "string"
          ? userMetadata.full_name
          : typeof userMetadata.name === "string"
            ? userMetadata.name
            : "";
      const fullName =
        metadataName.trim() || user.email?.split("@")[0] || "ECOLOGIX member";
      const { error: profileCreateError } = await adminClient
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullName,
          phone_number: null,
          role: "resident",
          is_active: true,
          must_change_password: false,
        });

      if (profileCreateError) {
        const { data: profileAfterRace, error: raceLookupError } =
          await adminClient
            .from("profiles")
            .select("role, is_active")
            .eq("id", user.id)
            .maybeSingle();

        if (raceLookupError || !profileAfterRace) {
          console.error("ECOLOGIX could not create a Google account profile.", {
            code: profileCreateError.code,
            message: profileCreateError.message,
          });
          await supabase.auth.signOut();
          return NextResponse.redirect(new URL("/app/account", request.url));
        }

        profile = profileAfterRace;
      } else {
        profile = {
          role: "resident",
          is_active: true,
        };
      }
    }

    if (!profile.is_active) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/app/account", request.url));
    }

    if (profile.role === "resident") {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.redirect(new URL("/app/workspaces", request.url));
  }

  return NextResponse.redirect(
    new URL(
      isCustomerRecovery
        ? "/app/account/recovery/update"
        : "/app/password-recovery/update",
      request.url,
    ),
  );
}
