import type { Metadata } from "next";

import { CollectionTracking } from "./tracking-form";

export const metadata: Metadata = { title: "Track collection | WastePay", description: "Track the status of your WastePay collection request." };

export default function TrackCollectionPage() {
  return <main className="wp-page-container py-10 sm:py-16"><section className="mx-auto max-w-2xl"><p className="wp-eyebrow">Collection tracking</p><h1 className="wp-section-title mt-6">See where your<br /><span className="wp-gradient-text">pickup stands.</span></h1><p className="wp-body mt-5 max-w-xl">Use the reference received after booking and the phone number used for your request. Your collection details stay private.</p><CollectionTracking /></section></main>;
}
