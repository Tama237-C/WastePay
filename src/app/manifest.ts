import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ECOLOGIX",
    short_name: "ECOLOGIX",
    description:
      "Cameroon's digital infrastructure for plastic collection, circular recovery, material intelligence, and transparent value distribution.",
    start_url: "/app",
    scope: "/app",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#075bb1",
    theme_color: "#075bb1",
    icons: [
  {
    src: "/icon",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icon",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
  {
    src: "/apple-icon",
    sizes: "180x180",
    type: "image/png",
    purpose: "any",
  },
],
    categories: [
      "business",
      "finance",
      "productivity",
      "utilities",
    ],
    lang: "en-CM",
    dir: "ltr",
    shortcuts: [
      {
        name: "Book Plastic Collection",
        short_name: "Book Pickup",
        description:
          "Request an ECOLOGIX plastic collection from your home or organization.",
        url: "/app#pickup",
      },
      {
        name: "Scan Plastic Packaging",
        short_name: "Scan",
        description: "Identify packaging and contribute plastic scan data.",
        url: "/app/scan",
      },
      {
        name: "Open ECOLOGIX account",
        short_name: "Account",
        description: "Sign in, create an account, or manage ECOLOGIX activity.",
        url: "/app/account",
      },
      {
        name: "Staff Sign In",
        short_name: "Staff",
        description:
          "Open secure ECOLOGIX operational staff access.",
        url: "/app/workspaces",
      },
    ],
  };
}
