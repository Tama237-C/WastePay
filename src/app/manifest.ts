import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WastePay",
    short_name: "WastePay",
    description:
      "Cameroon's digital infrastructure for plastic collection, circular recovery, material intelligence, and transparent value distribution.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#09090b",
    theme_color: "#09090b",
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
          "Request a WastePay plastic collection from your home or organization.",
        url: "/contact#home-collection",
      },
      {
        name: "View WastePay Impact",
        short_name: "Impact",
        description:
          "Explore live aggregate recovery metrics from the WastePay network.",
        url: "/impact",
      },
      {
        name: "Discuss a Partnership",
        short_name: "Partner",
        description:
          "Open the WastePay partnership enquiry journey.",
        url: "/contact?type=partnership",
      },
      {
        name: "Staff Sign In",
        short_name: "Staff",
        description:
          "Open secure WastePay operational staff access.",
        url: "/app/staff-login",
      },
    ],
  };
}