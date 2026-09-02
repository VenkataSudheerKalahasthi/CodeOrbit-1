# 🚀 CodeOrbit Deployment Guide (Vercel + Render)

This project is organized into two independent deployment directories:
- **`dsa/`** → Deploy to **Vercel** (DSA Platform & Practice Website)
- **`admin/`** → Deploy to **Vercel** (Standalone Admin Portal)
- **`backend/`** → Deploy to **Render** (Node.js Express Web Service)
- **`database/`** → Supabase Database schema and RLS policies

---

## 🌐 1. Deploy Main DSA Platform to Vercel

1. Push your repository to **GitHub**.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click `Edit` and select **`dsa`**
   - **Build Command**: *(leave empty)*
   - **Output Directory**: *(leave empty)*
5. Click **Deploy**.

> **Note**: The `dsa/vercel.json` file is already preconfigured with security headers and clean URL routing for `/reset-password` and `/auth-callback`.

---

## 🛡️ 2. Deploy Admin Portal to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Import your GitHub repository again.
3. In the **Configure Project** screen:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click `Edit` and select **`admin`**
   - **Build Command**: *(leave empty)*
   - **Output Directory**: *(leave empty)*
4. Click **Deploy**.

> **Note**: The `admin/vercel.json` file is already preconfigured with security headers and clean URL routing for `/dashboard`.

---

## ⚙️ 3. Deploy Backend to Render

### Method A: 1-Click Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect your repository.
4. Render will automatically detect **`backend/render.yaml`** and configure the Web Service with health check `/health`.
5. Under Environment Variables, supply your Supabase URL & Anon Key (or let it use defaults).
6. Set `FRONTEND_URL` to your Vercel URL (e.g., `https://your-dsa-domain.vercel.app`).
7. Click **Apply**.

### Method B: Manual Web Service Setup
1. Click **New +** → **Web Service**.
2. Connect your repository.
3. Configure the following fields:
   - **Name**: `codeorbit-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Add Environment Variables:
   - `PORT`: `10000`
   - `SUPABASE_URL`: `https://usfurexaoyzyskipqjdt.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_Hg2geAI3UL21Sskyj3mSEA_RqzEbB6x`
   - `FRONTEND_URL`: `https://your-dsa-domain.vercel.app` (your Vercel domain)
5. Click **Create Web Service**.

---

## 🗄️ 4. Supabase Auth & Redirect Configuration

In your [Supabase Dashboard](https://app.supabase.com):

1. Go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your Vercel DSA platform URL:
   ```
   https://your-dsa-domain.vercel.app
   ```
3. Under **Redirect URLs**, add:
   ```
   https://your-dsa-domain.vercel.app/reset-password.html
   https://your-dsa-domain.vercel.app/auth-callback.html
   https://your-admin-domain.vercel.app/index.html
   http://localhost:3000/reset-password.html
   http://localhost:3000/auth-callback.html
   http://localhost:3001/index.html
   ```

---

## 💻 5. Local Development

Run the entire workspace or specific components independently:

```bash
# 1. Run Main DSA Website (http://localhost:3000)
npm run dev:dsa

# 2. Run Admin Portal (http://localhost:3001)
npm run dev:admin

# 3. Run Render Backend (http://localhost:5000)
npm run dev:backend
```
