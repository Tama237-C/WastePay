"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.warn(
        "WastePay service workers are not supported in this browser.",
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
          "WastePay service worker registered successfully:",
          registration.scope,
        );
      } catch (error) {
        console.error(
          "WastePay service worker registration failed:",
          error,
        );
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}