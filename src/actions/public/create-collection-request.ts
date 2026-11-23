"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getVerifiedBookingUserId } from "@/lib/supabase/booking-user";

const allowedRequesterTypes = [
  "RESIDENT",
  "SCHOOL",
  "OFFICE",
  "HOTEL",
] as const;

type RequesterType = (typeof allowedRequesterTypes)[number];

export type CreateCollectionRequestState = {
  status: "idle" | "error" | "success";
  message: string;
  referenceNumber: string | null;
};

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRequesterType(value: string): value is RequesterType {
  return allowedRequesterTypes.some(
    (requesterType) => requesterType === value,
  );
}

function normalizeCameroonPhoneNumber(value: string): string | null {
  const cleanedValue = value.replace(/[\s()-]/g, "");

  if (/^\+2376\d{8}$/.test(cleanedValue)) {
    return cleanedValue;
  }

  if (/^6\d{8}$/.test(cleanedValue)) {
    return `+237${cleanedValue}`;
  }

  return null;
}

function parsePositiveInteger(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > 500
  ) {
    return null;
  }

  return parsedValue;
}

function parseOptionalWeight(value: string): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0 ||
    parsedValue > 50000
  ) {
    return null;
  }

  return parsedValue;
}

function parseLatitude(value: string): number | null {
  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < -90 ||
    parsedValue > 90
  ) {
    return null;
  }

  return parsedValue;
}

function parseLongitude(value: string): number | null {
  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < -180 ||
    parsedValue > 180
  ) {
    return null;
  }

  return parsedValue;
}

function createPublicReferenceNumber(requestId: string): string {
  return `WP-PICKUP-${requestId.slice(0, 8).toUpperCase()}`;
}

export async function createCollectionRequest(
  _previousState: CreateCollectionRequestState,
  formData: FormData,
): Promise<CreateCollectionRequestState> {
  const adminClient = createAdminClient();
  const { data: systemSettings, error: settingsError } = await adminClient
    .from("system_settings")
    .select("minimum_pickup_weight_kg, maximum_schedule_days, public_collection_requests_enabled")
    .eq("id", true)
    .maybeSingle();

  if (settingsError) {
    console.error("ECOLOGIX could not load public collection settings.", {
      code: settingsError.code,
      message: settingsError.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not load the current booking rules. Please try again shortly.",
      referenceNumber: null,
    };
  }

  const minimumPickupWeightKg = Number(systemSettings?.minimum_pickup_weight_kg ?? 15);
  const maximumScheduleDays = Number(systemSettings?.maximum_schedule_days ?? 30);

  if (systemSettings && !systemSettings.public_collection_requests_enabled) {
    return { status: "error", message: "Public collection requests are temporarily paused.", referenceNumber: null };
  }

  const requesterTypeInput = normalizeText(formData.get("requesterType"));
  const requesterName = normalizeText(formData.get("requesterName"));
  const phoneNumberInput = normalizeText(formData.get("phoneNumber"));
  const neighbourhood = normalizeText(formData.get("neighbourhood"));
  const estimatedBagCountInput = normalizeText(
    formData.get("estimatedBagCount"),
  );
  const estimatedWeightInput = normalizeText(
    formData.get("estimatedWeightKg"),
  );
  const latitudeInput = normalizeText(formData.get("latitude"));
  const longitudeInput = normalizeText(formData.get("longitude"));
  const preferredPickupStartInput = normalizeText(
    formData.get("preferredPickupStart"),
  );
  const preferredPickupEndInput = normalizeText(
    formData.get("preferredPickupEnd"),
  );
  const websiteHoneypot = normalizeText(formData.get("website"));
  const formStartedAtInput = normalizeText(formData.get("formStartedAt"));

  if (websiteHoneypot) {
    return {
      status: "error",
      message: "The request could not be submitted.",
      referenceNumber: null,
    };
  }

  const formStartedAt = Number(formStartedAtInput);
  const submissionAgeMilliseconds = Date.now() - formStartedAt;

  if (
    !Number.isFinite(formStartedAt) ||
    submissionAgeMilliseconds < 3000 ||
    submissionAgeMilliseconds > 24 * 60 * 60 * 1000
  ) {
    return {
      status: "error",
      message:
        "The form session expired or was submitted too quickly. Refresh the page and try again.",
      referenceNumber: null,
    };
  }

  if (!isRequesterType(requesterTypeInput)) {
    return {
      status: "error",
      message: "Select a valid collection request type.",
      referenceNumber: null,
    };
  }

  if (requesterName.length < 3 || requesterName.length > 120) {
    return {
      status: "error",
      message: "Enter your complete name or organization name.",
      referenceNumber: null,
    };
  }

  const phoneNumber = normalizeCameroonPhoneNumber(phoneNumberInput);

  if (!phoneNumber) {
    return {
      status: "error",
      message:
        "Enter an active Cameroon WhatsApp number, such as +2376XXXXXXXX.",
      referenceNumber: null,
    };
  }

  if (neighbourhood.length < 2 || neighbourhood.length > 150) {
    return {
      status: "error",
      message: "Enter the neighbourhood where the waste is located.",
      referenceNumber: null,
    };
  }

  const estimatedBagCount = parsePositiveInteger(
    estimatedBagCountInput,
  );

  if (estimatedBagCount === null) {
    return {
      status: "error",
      message: "Estimated bag count must be between 1 and 500.",
      referenceNumber: null,
    };
  }

  const estimatedWeightKg = parseOptionalWeight(estimatedWeightInput);

  if (estimatedWeightKg === null || estimatedWeightKg < minimumPickupWeightKg) {
    return {
      status: "error",
      message:
        `Home collection requires an estimated plastic weight of at least ${minimumPickupWeightKg} kilograms.`,
      referenceNumber: null,
    };
  }

  const latitude = parseLatitude(latitudeInput);
  const longitude = parseLongitude(longitudeInput);

  if (latitude === null || longitude === null) {
    return {
      status: "error",
      message:
        "Capture your pickup location before submitting the request.",
      referenceNumber: null,
    };
  }

  const preferredPickupStart = new Date(preferredPickupStartInput);
  const preferredPickupEnd = new Date(preferredPickupEndInput);
  const earliestPickupTime = Date.now() + 2 * 60 * 60 * 1000;
  const latestPickupTime = Date.now() + maximumScheduleDays * 24 * 60 * 60 * 1000;

  if (
    Number.isNaN(preferredPickupStart.getTime()) ||
    Number.isNaN(preferredPickupEnd.getTime()) ||
    preferredPickupStart.getTime() < earliestPickupTime ||
    preferredPickupEnd <= preferredPickupStart ||
    preferredPickupEnd.getTime() > latestPickupTime
  ) {
    return {
      status: "error",
      message:
        `Choose a valid pickup window at least two hours from now and within the next ${maximumScheduleDays} days.`,
      referenceNumber: null,
    };
  }

  const tenMinutesAgo = new Date(
    Date.now() - 10 * 60 * 1000,
  ).toISOString();

  const { count: recentRequestCount, error: recentRequestError } =
    await adminClient
      .from("collection_requests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("phone_number", phoneNumber)
      .gte("requested_at", tenMinutesAgo);

  if (recentRequestError) {
    console.error("ECOLOGIX could not check the recent request limit.", {
      code: recentRequestError.code,
      message: recentRequestError.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not verify this request. Please try again shortly.",
      referenceNumber: null,
    };
  }

  if ((recentRequestCount ?? 0) >= 3) {
    return {
      status: "error",
      message:
        "Too many requests were submitted from this phone number. Wait ten minutes before trying again.",
      referenceNumber: null,
    };
  }

  const pickupLocation = `POINT(${longitude} ${latitude})`;
  const serverClient = await createServerClient();
  let residentProfileId: string | null = null;
  const { userId, error: authError } =
    await getVerifiedBookingUserId(serverClient);

  if (authError) {
    console.error("ECOLOGIX could not read the booking session.", {
      code: authError.code,
      message: authError.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not check your account session. Refresh the app and try again.",
      referenceNumber: null,
    };
  }

  if (userId) {
    const { data: profile, error: profileError } = await serverClient
      .from("profiles")
      .select("role, is_active")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("ECOLOGIX could not verify the booking profile.", {
        code: profileError.code,
        message: profileError.message,
      });
      return {
        status: "error",
        message: "ECOLOGIX could not verify your customer profile. Try again.",
        referenceNumber: null,
      };
    }

    if (profile?.role === "resident" && profile.is_active) {
      residentProfileId = userId;
    }
  }

  const { data: createdRequest, error: insertError } = await adminClient
    .from("collection_requests")
    .insert({
      requester_type: requesterTypeInput,
      requester_name: requesterName,
      phone_number: phoneNumber,
      neighbourhood,
      estimated_bag_count: estimatedBagCount,
      estimated_weight_kg: estimatedWeightKg,
      pickup_location: pickupLocation,
      preferred_pickup_start: preferredPickupStart.toISOString(),
      preferred_pickup_end: preferredPickupEnd.toISOString(),
      resident_profile_id: residentProfileId,
      status: "PENDING_REVIEW",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("ECOLOGIX could not save the collection request.", {
      code: insertError.code,
      message: insertError.message,
    });
    return {
      status: "error",
      message:
        `ECOLOGIX could not save your collection request${insertError.code ? ` (error ${insertError.code})` : ""}. Please try again; contact support if it continues.`,
      referenceNumber: null,
    };
  }

  if (!createdRequest) {
    console.error("ECOLOGIX created no collection request record.");
    return {
      status: "error",
      message:
        "ECOLOGIX could not confirm that your collection request was saved. Contact support before submitting it again.",
      referenceNumber: null,
    };
  }

  const { error: eventError } = await adminClient
    .from("collection_request_events")
    .insert({
    collection_request_id: createdRequest.id,
    previous_status: null,
    new_status: "PENDING_REVIEW",
    reason: "Collection request submitted.",
  });

  if (eventError) {
    console.error("ECOLOGIX could not record the initial collection event.", {
      code: eventError.code,
      message: eventError.message,
      requestId: createdRequest.id,
    });
  }

  revalidatePath("/admin/collection-requests");
  revalidatePath("/admin/overview");

  return {
    status: "success",
    message: eventError
      ? "Your pickup request was saved and is awaiting review. Its status timeline may take time to appear."
      : "Your collection request has been received and is awaiting review by the ECOLOGIX operations team.",
    referenceNumber: createPublicReferenceNumber(createdRequest.id),
  };
}
