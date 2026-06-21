# IdeaSite Studio

This repository contains two separate apps:

- `frontend`: Next.js portfolio site
- `backend`: Express API with SQL Server connectivity

## Deploy Frontend To Vercel

The public website is in the `frontend` folder. In Vercel, set:

```text
Root Directory: frontend
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Add this Vercel environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

If you deploy the repository root by mistake, `vercel.json` at the root delegates the build to `frontend`.

## Backend

Do not deploy the `backend` folder to Vercel as a normal Express server. It needs a long-running Node host and SQL Server connectivity.

Use Azure App Service, Render, Railway, or a VPS for the backend.
