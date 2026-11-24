const CACHE_VERSION = "ecologix-public-v3";

const PUBLIC_CACHE_URLS = [
  "/",
  "/about",
  "/how-it-works",
  "/impact",
  "/programs",
  "/partners",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/accessibility",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PUBLIC_CACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isNextRouterRequest =
    request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.has("next-router-state-tree") ||
    requestUrl.searchParams.has("_rsc");

  if (isNextRouterRequest) {
    event.respondWith(fetch(request));
    return;
  }

  const isProtectedRoute =
    requestUrl.pathname.startsWith("/admin") ||
    requestUrl.pathname.startsWith("/app");

  if (isProtectedRoute) {
    event.respondWith(fetch(request));
    return;
  }

  const isNavigationRequest = request.mode === "navigate";

  if (isNavigationRequest) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseCopy = networkResponse.clone();

          caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, responseCopy));

          return networkResponse;
        })
        .catch(async () => {
          const exactCachedResponse = await caches.match(request);

          if (exactCachedResponse) {
            return exactCachedResponse;
          }

          const homepageResponse = await caches.match("/");

          if (homepageResponse) {
            return homepageResponse;
          }

          return new Response(
            `
              <!doctype html>
              <html lang="en">
                <head>
                  <meta charset="utf-8" />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                  />
                  <meta name="theme-color" content="#047857" />
                  <title>ECOLOGIX Offline</title>
                  <style>
                    * {
                      box-sizing: border-box;
                    }

                    body {
                      margin: 0;
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      padding: 24px;
                      background:
                        radial-gradient(
                          circle at top left,
                          rgba(16, 185, 129, 0.18),
                          transparent 42%
                        ),
                        #020617;
                      color: #f8fafc;
                      font-family:
                        Arial,
                        Helvetica,
                        sans-serif;
                    }

                    main {
                      width: 100%;
                      max-width: 640px;
                      padding: 40px;
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 32px;
                      background: rgba(15, 23, 42, 0.82);
                      box-shadow: 0 32px 90px rgba(0, 0, 0, 0.4);
                    }

                    .badge {
                      color: #34d399;
                      font-size: 12px;
                      font-weight: 900;
                      letter-spacing: 0.2em;
                      text-transform: uppercase;
                    }

                    h1 {
                      margin: 24px 0 0;
                      font-size: clamp(40px, 10vw, 72px);
                      line-height: 0.95;
                      letter-spacing: -0.06em;
                    }

                    p {
                      margin: 24px 0 0;
                      color: #94a3b8;
                      font-size: 18px;
                      line-height: 1.7;
                    }

                    button {
                      margin-top: 30px;
                      min-height: 54px;
                      padding: 14px 22px;
                      border: 0;
                      border-radius: 18px;
                      background: #34d399;
                      color: #02140f;
                      font-weight: 900;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      cursor: pointer;
                    }
                  </style>
                </head>

                <body>
                  <main>
                    <div class="badge">ECOLOGIX offline</div>

                    <h1>Connection unavailable.</h1>

                    <p>
                      ECOLOGIX cannot reach the network right now. Reconnect
                      to the internet before submitting a collection,
                      partnership, staff, depot, payment, or transaction action.
                    </p>

                    <button onclick="window.location.reload()">
                      Try again
                    </button>
                  </main>
                </body>
              </html>
            `,
            {
              status: 503,
              headers: {
                "Content-Type": "text/html; charset=utf-8",
              },
            },
          );
        }),
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        const responseCopy = networkResponse.clone();

        caches
          .open(CACHE_VERSION)
          .then((cache) => cache.put(request, responseCopy));

        return networkResponse;
      });
    }),
  );
});
