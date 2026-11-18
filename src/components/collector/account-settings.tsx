"use client";

import { useActionState, useState } from "react";
import { updateCollectorAccount, type UpdateCollectorAccountState } from "@/actions/auth/update-collector-account";

const initialState: UpdateCollectorAccountState = { status: "idle", message: "" };

export function AccountSettings({ fullName, phoneNumber, provider }: { fullName: string | null; phoneNumber: string | null; provider: "MTN_MOMO" | "ORANGE_MONEY" | null }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(updateCollectorAccount, initialState);
  return <section className="wp-account-settings"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span><b>Manage payout account</b><small>Update your Mobile Money details</small></span><i>{open ? "−" : "+"}</i></button>{open ? <form action={action}><label htmlFor="fullName">Full name<input id="fullName" name="fullName" defaultValue={fullName ?? ""} required /></label><label htmlFor="phoneNumber">Mobile Money number<input id="phoneNumber" name="phoneNumber" type="tel" inputMode="tel" defaultValue={phoneNumber ?? ""} placeholder="+2376XXXXXXXX" required /></label><label htmlFor="provider">Provider<select id="provider" name="provider" defaultValue={provider ?? "MTN_MOMO"}><option value="MTN_MOMO">MTN Mobile Money</option><option value="ORANGE_MONEY">Orange Money</option></select></label><button type="submit" className="wp-primary-button">Save payout details</button>{state.status !== "idle" ? <p className={state.status === "success" ? "wp-account-settings__success" : "wp-tracking-error"} role="status">{state.message}</p> : null}</form> : null}</section>;
}
