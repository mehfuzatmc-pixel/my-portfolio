# IdeaSite Studio

This front end is a Next.js website for a web creator whose message is: "I will turn your ideas into websites." It uses a custom generated hero image, service-focused sections, and the Next.js App Router.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Deploy To Vercel

Set the Vercel project root directory to this `frontend` folder.

```text
Root Directory: frontend
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Add this environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Contact API

The contact form posts to `http://127.0.0.1:5000/api/contact` by default. To point it somewhere else, create a `.env.local` file and set:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

## Private Admin

The public portfolio does not show signup/signin. Admin access lives at:

`/admin`

Use it to view contact form submissions from SQL Server.

## Consultation Payments

The Consultation Fees section calls the backend payment endpoint:

`POST /api/payments/consultation-checkout`

Add your Stripe secret key in `backend/.env` before using live checkout.
