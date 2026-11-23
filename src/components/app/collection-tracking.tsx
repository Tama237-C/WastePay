"use client";

import { useActionState } from "react";
import {
  trackCollectionRequest,
  type TrackingState,
} from "@/actions/public/track-collection-request";

const initialState: TrackingState = { status: "idle", message: "", request: null };
const statusLabels: Record<string, string> = { PENDING_REVIEW: "Request received", APPROVED: "Approved", ASSIGNED: "Driver assigned", IN_TRANSIT: "Driver en route", COLLECTED_PENDING_DEPOT: "Collected", COMPLETED: "Completed", REJECTED: "Needs attention", UNREACHABLE: "Could not reach you", RESCHEDULED: "Rescheduled", CANCELLED: "Cancelled" };

function formatDate(value: string) { return new Intl.DateTimeFormat("en-CM", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export function CollectionTracking() {
  const [state, action] = useActionState(trackCollectionRequest, initialState);
  const request = state.request;
  return <section className="wp-tracking-card"><form action={action} className="grid gap-4"><div><label htmlFor="reference">Collection reference</label><input id="reference" name="reference" required placeholder="WP-PICKUP-1234ABCD" autoCapitalize="characters" /></div><div><label htmlFor="phoneNumber">Phone number used for booking</label><input id="phoneNumber" name="phoneNumber" type="tel" required placeholder="+2376XXXXXXXX" inputMode="tel" /></div><button type="submit" className="wp-primary-button">Track my collection <span aria-hidden="true">â†’</span></button></form>{state.status === "error" ? <p className="wp-tracking-error" role="alert">{state.message}</p> : null}{request ? <div className="wp-tracking-result"><div className="wp-tracking-result__top"><div><p className="wp-overline">{request.reference}</p><h2>{statusLabels[request.status] ?? request.status}</h2><span>{request.neighbourhood}</span></div><span className="wp-status-dot">Active record</span></div>{request.preferredStart && request.preferredEnd ? <p className="wp-tracking-window">Preferred window · {formatDate(request.preferredStart)} — {formatDate(request.preferredEnd)}</p> : null}<div className="wp-tracking-timeline">{request.events.length ? request.events.map((event, index) => <article key={`${event.status}-${event.createdAt}`}><i className={index === request.events.length - 1 ? "is-current" : ""} /><div><strong>{statusLabels[event.status] ?? event.status}</strong><p>{event.reason ?? "Status updated by the ECOLOGIX operations team."}</p><small>{formatDate(event.createdAt)}</small></div></article>) : <article><i className="is-current" /><div><strong>{statusLabels[request.status] ?? request.status}</strong><p>Your request is recorded in the ECOLOGIX network.</p><small>{formatDate(request.requestedAt)}</small></div></article>}</div></div> : null}</section>;
}
