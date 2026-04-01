# Fry Shack Social Giveaway Landing Page

One-page, mobile-first competition landing page built with React + Vite + Tailwind CSS.

## Features

- Full hero experience with The Fry Shack and The Globe Trotter branding
- Background image with dark overlay for readability
- Competition requirements checklist
- Entry form with required fields and two image uploads
- File validation (image-only, max 5MB each)
- Uploads to Cloudinary, then row append to Google Sheet via Google Apps Script
- Loading state and success message after submission

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

3. Add your values:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET` (unsigned preset)
- `VITE_GOOGLE_SCRIPT_URL` (Apps Script web app URL)

4. Run locally:

```bash
npm run dev
```

## Google Apps Script Setup

1. Open a Google Sheet.
2. Go to **Extensions -> Apps Script**.
3. Paste the contents of `google-apps-script.js`.
4. Save and deploy as a Web App:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployed URL into `VITE_GOOGLE_SCRIPT_URL`.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Create an **Unsigned Upload Preset**.
3. Set preset name in `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. Set cloud name in `VITE_CLOUDINARY_CLOUD_NAME`.

## Build

```bash
npm run build
```

## Deploy

Deploy on Vercel or Netlify using standard Vite static hosting settings.
