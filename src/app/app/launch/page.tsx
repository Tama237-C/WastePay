import type { Metadata } from "next";

import { AppSplashScreen } from "@/components/app/app-splash-screen";

export const metadata: Metadata = {
  title: "ECOLOGIX",
  description: "Connecting Cameroon’s circular economy.",
};

export default function AppLaunchPage() {
  return <AppSplashScreen />;
}
