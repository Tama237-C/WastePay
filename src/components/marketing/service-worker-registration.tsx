"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.warn(
        "ECOLOGIX service workers are not supported in this browser.",
      );

      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration =
          await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

        console.log(
          "ECOLOGIX service worker registered successfully:",
          registration.scope,
        );
      } catch (error) {
        console.error(
          "ECOLOGIX service worker registration failed:",
          error,
        );
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}