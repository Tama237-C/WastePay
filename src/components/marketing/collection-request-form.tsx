"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

import {
  createCollectionRequest,
  type CreateCollectionRequestState,
} from "@/actions/public/create-collection-request";

const initialState: CreateCollectionRequestState = {
  status: "idle",
  message: "",
  referenceNumber: null,
};

type LocationState =
  | {
      status: "idle";
      message: string;
    }
  | {
      status: "loading";
      message: string;
    }
  | {
      status: "success";
      message: string;
      latitude: number;
      longitude: number;
    }
  | {
      status: "error";
      message: string;
    };

function SubmitButton({
  locationReady,
}: {
  locationReady: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || !locationReady}
      className="group flex min-h-14 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
    >
      {pending ? (
        <>
          <span>Submitting request</span>

          <span
            aria-hidden="true"
            className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
          />
        </>
      ) : (
        <>
          <span>Request home collection</span>

          <span
            aria-hidden="true"
            className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </>
      )}
    </button>
  );
}

export function CollectionRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [formStartedAt, setFormStartedAt] = useState("");
  const [locationState, setLocationState] =
    useState<LocationState>({
      status: "idle",
      message: "Your location has not been captured yet.",
    });

  const [state, formAction] = useActionState(
    createCollectionRequest,
    initialState,
  );

  useEffect(() => {
    setFormStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();

      setLocationState({
        status: "idle",
        message: "Your location has not been captured yet.",
      });

      setFormStartedAt(String(Date.now()));
    }
  }, [state.status]);

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationState({
        status: "error",
        message:
          "This browser does not support location capture. Use a modern mobile browser.",
      });

      return;
    }

    setLocationState({
      status: "loading",
      message: "Capturing your secure pickup location...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          status: "success",
          message: "Pickup location captured successfully.",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message =
          "WastePay could not capture your location. Check your browser permissions and try again.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Allow location access in your browser and try again.";
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          message =
            "Your location is temporarily unavailable. Move near a window or outdoors and try again.";
        }

        if (error.code === error.TIMEOUT) {
          message =
            "Location capture took too long. Check your connection and try again.";
        }

        setLocationState({
          status: "error",
          message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  const locationReady = locationState.status === "success";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
      {state.status === "success" && state.referenceNumber ? (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]" />

            <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-300">
              Request received
            </p>
          </div>

          <h2 className="mt-7 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            WastePay will review your pickup.
          </h2>

          <p className="mt-5 text-base font-light leading-7 text-emerald-100/75">
            {state.message}
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-500">
              Request reference
            </p>

            <p className="mt-3 break-all font-mono text-lg font-black text-emerald-300">
              {state.referenceNumber}
            </p>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-400">
            Keep this reference. A WastePay representative may contact you
            through the phone number submitted.
          </p>
        </div>
      ) : (
        <form
          ref={formRef}
          action={formAction}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="formStartedAt"
            value={formStartedAt}
          />

          <div
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="website">
              Leave this field empty
            </label>

            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <fieldset>
            <legend className="text-xs font-black uppercase tracking-[0.26em] text-emerald-400">
              Your information
            </legend>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="requesterType"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Request type
                </label>

                <select
                  id="requesterType"
                  name="requesterType"
                  required
                  defaultValue="RESIDENT"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-base text-white outline-none transition-all focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                >
                  <option value="RESIDENT">Residential home</option>
                  <option value="OFFICE">Office or company</option>
                  <option value="SCHOOL">School or university</option>
                  <option value="HOTEL">Hotel or hospitality</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="requesterName"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Name
                </label>

                <input
                  id="requesterName"
                  name="requesterName"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={120}
                  placeholder="Your complete name"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Active WhatsApp number
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+2376XXXXXXXX"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="neighbourhood"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Neighbourhood
                </label>

                <input
                  id="neighbourhood"
                  name="neighbourhood"
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Akwa, Bonamoussadi, Bastos..."
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-black uppercase tracking-[0.26em] text-sky-400">
              Waste estimate
            </legend>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="estimatedBagCount"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Estimated bag count
                </label>

                <input
                  id="estimatedBagCount"
                  name="estimatedBagCount"
                  type="number"
                  required
                  min="1"
                  max="500"
                  step="1"
                  placeholder="4"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="estimatedWeightKg"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Estimated weight KG
                  <span className="ml-2 text-[0.6rem] text-slate-700">
                    Optional
                  </span>
                </label>

                <input
                  id="estimatedWeightKg"
                  name="estimatedWeightKg"
                  type="number"
                  min="0.001"
                  max="50000"
                  step="0.001"
                  placeholder="25"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-black uppercase tracking-[0.26em] text-violet-400">
              Secure pickup location
            </legend>

            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-5 sm:p-6">
              <button
                type="button"
                onClick={captureLocation}
                disabled={locationState.status === "loading"}
                className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-violet-200 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-violet-400/15 focus:outline-none focus:ring-4 focus:ring-violet-400/10 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {locationState.status === "loading"
                  ? "Capturing location"
                  : locationReady
                    ? "Location captured — capture again"
                    : "Capture my exact GPS location"}
              </button>

              <div
                className={`mt-4 rounded-2xl border p-4 ${
                  locationState.status === "success"
                    ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                    : locationState.status === "error"
                      ? "border-red-400/20 bg-red-400/[0.07]"
                      : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <p
                  className={`text-sm leading-6 ${
                    locationState.status === "success"
                      ? "text-emerald-200"
                      : locationState.status === "error"
                        ? "text-red-200"
                        : "text-slate-500"
                  }`}
                >
                  {locationState.message}
                </p>

                {locationState.status === "success" ? (
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    {locationState.latitude.toFixed(6)},{" "}
                    {locationState.longitude.toFixed(6)}
                  </p>
                ) : null}
              </div>

              <input
                type="hidden"
                name="latitude"
                value={
                  locationState.status === "success"
                    ? String(locationState.latitude)
                    : ""
                }
              />

              <input
                type="hidden"
                name="longitude"
                value={
                  locationState.status === "success"
                    ? String(locationState.longitude)
                    : ""
                }
              />
            </div>
          </fieldset>

          {state.status === "error" ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5"
            >
              <p className="text-sm font-medium leading-6 text-red-200">
                {state.message}
              </p>
            </div>
          ) : null}

          <div className="border-t border-white/10 pt-7">
            <SubmitButton locationReady={locationReady} />

            <p className="mt-5 text-center text-xs leading-5 text-slate-600">
              Your location is used only to review and route this WastePay
              collection request.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}