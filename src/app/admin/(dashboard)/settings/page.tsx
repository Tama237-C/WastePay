import { SystemSettingsForm } from "@/components/admin/system-settings-form";
import { createAdminClient } from "@/lib/supabase/admin";

const defaultSettings = {
  minimum_pickup_weight_kg: 15,
  maximum_schedule_days: 30,
  pickup_photo_max_mb: 5,
  require_manager_payout_approval: true,
  public_collection_requests_enabled: true,
  payout_queue_enabled: true,
  maintenance_message: null,
};

export default async function SystemSettingsPage() {
  const adminClient = createAdminClient();
  const { data: settings, error } = await adminClient
    .from("system_settings")
    .select(
      "minimum_pickup_weight_kg, maximum_schedule_days, pickup_photo_max_mb, require_manager_payout_approval, public_collection_requests_enabled, payout_queue_enabled, maintenance_message, updated_at",
    )
    .eq("id", true)
    .maybeSingle();

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">
          Platform configuration
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          System settings
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
          Configure collection limits, operational switches, approval
          requirements, and maintenance messaging. Changes are restricted to
          active administrators.
        </p>
        {settings?.updated_at ? (
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-600">
            Last updated{" "}
            {new Intl.DateTimeFormat("en-CM", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(settings.updated_at))}
          </p>
        ) : null}
      </section>

      {error ? (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-5 text-sm leading-7 text-amber-100">
          The system settings table is not available yet. Run migration
          202607270004 in Supabase before saving configuration.
        </p>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl sm:p-8">
        <SystemSettingsForm
          settings={{
            minimum_pickup_weight_kg: Number(
              settings?.minimum_pickup_weight_kg ??
                defaultSettings.minimum_pickup_weight_kg,
            ),
            maximum_schedule_days:
              settings?.maximum_schedule_days ??
              defaultSettings.maximum_schedule_days,
            pickup_photo_max_mb:
              settings?.pickup_photo_max_mb ??
              defaultSettings.pickup_photo_max_mb,
            require_manager_payout_approval:
              settings?.require_manager_payout_approval ??
              defaultSettings.require_manager_payout_approval,
            public_collection_requests_enabled:
              settings?.public_collection_requests_enabled ??
              defaultSettings.public_collection_requests_enabled,
            payout_queue_enabled:
              settings?.payout_queue_enabled ??
              defaultSettings.payout_queue_enabled,
            maintenance_message:
              settings?.maintenance_message ??
              defaultSettings.maintenance_message,
          }}
        />
      </section>

      <section className="rounded-[2rem] border border-amber-400/15 bg-amber-400/[0.05] p-7">
        <h2 className="text-xl font-black text-amber-200">
          Protected configuration
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-100/60">
          Supabase service keys and future telecom API secrets remain in server
          environment variables. They are never displayed or stored by this
          form.
        </p>
      </section>
    </div>
  );
}
