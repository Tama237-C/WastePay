import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/app/password-recovery?status=invalid", request.url),
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
      new URL("/app/password-recovery?status=invalid", request.url),
    );
  }

  return NextResponse.redirect(
    new URL("/app/password-recovery/update", request.url),
  );
}
