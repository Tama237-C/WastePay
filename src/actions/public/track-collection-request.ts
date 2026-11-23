"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type TrackingState = {
  status: "idle" | "error" | "success";
  message: string;
  request: null | {
    reference: string;
    neighbourhood: string;
    status: string;
    requestedAt: string;
    preferredStart: string | null;
    preferredEnd: string | null;
    events: { status: string; reason: string | null; createdAt: string }[];
  };
};

const initialError = (message: string): TrackingState => ({ status: "error", message, request: null });

function normalisePhone(value: string): string | null {
  const cleaned = value.replace(/[\s()-]/g, "");
  if (/^\+2376\d{8}$/.test(cleaned)) return cleaned;
  if (/^6\d{8}$/.test(cleaned)) return `+237${cleaned}`;
  return null;
}

export async function trackCollectionRequest(_previous: TrackingState, formData: FormData): Promise<TrackingState> {
  const reference = String(formData.get("reference") ?? "").trim().toUpperCase();
  const phone = normalisePhone(String(formData.get("phoneNumber") ?? "").trim());
  const match = /^WP-PICKUP-([A-F0-9]{8})$/.exec(reference);
  if (!match || !phone) return initialError("Enter your ECOLOGIX reference and the phone number used for this request.");

  const admin = createAdminClient();
  const { data: request, error } = await admin
    .from("collection_requests")
    .select("id, neighbourhood, status, requested_at, preferred_pickup_start, preferred_pickup_end, collection_request_events(new_status, reason, created_at)")
    .ilike("id", `${match[1]}%`)
    .eq("phone_number", phone)
    .maybeSingle();

  if (error) {
    console.error("ECOLOGIX could not look up a collection request.", {
      code: error.code,
      message: error.message,
    });
    return initialError(
      `ECOLOGIX could not check the tracking service${error.code ? ` (error ${error.code})` : ""}. Please try again shortly.`,
    );
  }

  if (!request) {
    return initialError(
      "We could not find a request with those details. Check the reference and phone number, then try again.",
    );
  }
  const events = (request.collection_request_events ?? []).map((event) => ({ status: event.new_status, reason: event.reason, createdAt: event.created_at })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return {
    status: "success",
    message: "Request located.",
    request: { reference, neighbourhood: request.neighbourhood, status: request.status, requestedAt: request.requested_at, preferredStart: request.preferred_pickup_start, preferredEnd: request.preferred_pickup_end, events },
  };
}
