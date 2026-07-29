"use client";

import { useActionState } from "react";

import {
  updateSystemSettings,
  type UpdateSystemSettingsState,
} from "@/actions/admin/update-system-settings";

type Settings = {
  minimum_pickup_weight_kg: number;
  maximum_schedule_days: number;
  pickup_photo_max_mb: number;
  require_manager_payout_approval: boolean;
  public_collection_requests_enabled: boolean;
  payout_queue_enabled: boolean;
  maintenance_message: string | null;
};

const initialState: UpdateSystemSettingsState = {
  status: "idle",
  message: "",
};

export function SystemSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(
    updateSystemSettings,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-7">
      <section className="grid gap-5 md:grid-cols-3">
        <label className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
          Minimum pickup weight (KG)
          <input
            name="minimumPickupWeightKg"
            type="number"
            min="0.01"
            max="1000"
            step="0.01"
            required
            defaultValue={settings.minimum_pickup_weight_kg}
            className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-400/50"
          />
        </label>
        <label className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
          Maximum scheduling period (days)
          <input
            name="maximumScheduleDays"
            type="number"
            min="1"
            max="90"
            required
            defaultValue={settings.maximum_schedule_days}
            className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-sky-400/50"
          />
        </label>
        <label className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
          Pickup photo limit (MB)
          <input
            name="pickupPhotoMaxMb"
            type="number"
            min="1"
            max="20"
            required
            defaultValue={settings.pickup_photo_max_mb}
            className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-violet-400/50"
          />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            name: "publicCollectionRequestsEnabled",
            label: "Public collection requests",
            detail: "Allow new pickup requests from the public website.",
            checked: settings.public_collection_requests_enabled,
          },
          {
            name: "payoutQueueEnabled",
            label: "Payout queue",
            detail: "Allow approved transactions to enter payout processing.",
            checked: settings.payout_queue_enabled,
          },
          {
            name: "requireManagerPayoutApproval",
            label: "Manager payout approval",
            detail: "Require depot manager approval before payout queuing.",
            checked: settings.require_manager_payout_approval,
          },
        ].map((setting) => (
          <label
            key={setting.name}
            className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-5"
          >
            <input
              name={setting.name}
              type="checkbox"
              defaultChecked={setting.checked}
              className="mt-1 h-5 w-5 accent-emerald-400"
            />
            <span>
              <span className="block font-black text-white">{setting.label}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-500">
                {setting.detail}
              </span>
            </span>
          </label>
        ))}
      </section>

      <label className="block rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
        Maintenance message
        <textarea
          name="maintenanceMessage"
          rows={4}
          maxLength={500}
          defaultValue={settings.maintenance_message ?? ""}
          placeholder="Optional message shown when an operational service is paused."
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-700 focus:border-amber-400/50"
        />
      </label>

      {state.message ? (
        <p
          className={`rounded-2xl border p-4 text-sm ${
            state.status === "success"
              ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200"
              : "border-red-400/20 bg-red-400/[0.08] text-red-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-14 rounded-2xl bg-emerald-400 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving configuration..." : "Save system configuration"}
      </button>
    </form>
  );
}
