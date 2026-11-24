# ECOLOGIX

ECOLOGIX is a Next.js and Supabase platform for plastic collection, depot buyback operations, barcode intelligence, and environmental impact reporting.

## Configuration

Copy `.env.example` to `.env.local` and set the Supabase values. Set `NEXT_PUBLIC_SITE_URL` to the canonical site URL, then add that site's `/auth/callback`, `/auth/callback?flow=customer`, and `/auth/callback?flow=customer_google` URLs to Supabase Authentication redirect URLs. Include the matching `http://localhost:3000` callback URLs when testing locally. Enable the Google provider in Supabase Authentication before using Google sign-in. Local development uses `ECOLOGIX_INTEGRATION_MODE=mock`; mock mode never sends money or SMS messages. Provider credentials are only needed before switching to `live`.

Database changes are versioned in `supabase/migrations`. Apply the complete migration history to a clean Supabase project before use.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run build
```

GitHub Actions runs these checks on every push and pull request.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
