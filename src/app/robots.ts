import type { MetadataRoute } from "next";

const productionBaseUrl = "https://wastepay.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/app",
          "/app/",
        ],
      },
    ],
    sitemap: `${productionBaseUrl}/sitemap.xml`,
    host: productionBaseUrl,
  };
}