# IdeaSite Studio

This repository contains a deployable portfolio frontend and a separate API:

- Root folder: Next.js portfolio site for Vercel
- `backend`: Express API with SQL Server connectivity

## Deploy Frontend To Vercel

The public website now deploys from the repository root. In Vercel, set:

```text
Root Directory: leave empty
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
```

Add this Vercel environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Do not set the output directory to `.next`. Vercel detects and serves Next.js apps automatically.

## Backend

Do not deploy the `backend` folder to Vercel as a normal Express server. It needs a long-running Node host and SQL Server connectivity.

Use Azure App Service, Render, Railway, or a VPS for the backend.
