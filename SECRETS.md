# SuperSearch Environment Variable Deployment Guide

Because we explicitly `.gitignore` your `.env` file, your API keys are **safe and will not be pushed to GitHub**. 
However, for your Cloudflare deployment to work in production, those APIs must be fed into your deployment environment.

Depending on how you deploy SuperSearchPortal, follow the instructions below:

## Method 1: Deploying via Cloudflare Pages Dashboard (Recommended & Fastest)

If you linked your GitHub repository directly to Cloudflare Pages, Cloudflare handles the build.

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Select your `super-search` or `pye-ton-super-search` project.
3. Click on **Settings** -> **Environment variables**.
4. In the **Production** (and optionally Preview) section, click **Add variables**.
5. Copy the variables from your local `.env` and paste them here exactly as they are named.

You need to add all required keys:
- `VITE_DEEPSEEK_KEY`
- `VITE_ALPHA_VANTAGE_KEY`
- `VITE_FINNHUB_KEY`
- `VITE_NEWSDATA_KEY`
- `VITE_GUARDIAN_KEY`
- `VITE_GNEWS_KEY`
- `VITE_FMP_KEY`
- `VITE_WORLDNEWS_KEY`

6. Click **Save and Encrypt**.
7. Go to the **Deployments** tab and click **Retry deployment** so the new build has access to your keys!

---

## Method 2: Deploying via GitHub Actions (CI/CD)

If you have a customized `.github/workflows/deploy.yml` that uses Wrangler/Cloudflare CLI to push the build:

1. Go to your repository on GitHub: `https://github.com/pye-ton/super_search`
2. Navigate to **Settings** -> **Security** -> **Secrets and variables** -> **Actions**.
3. Under **Repository secrets**, click **New repository secret**.
4. Add each exactly as it appears in your `.env`:
   - Name: `VITE_DEEPSEEK_KEY`
   - Secret (Value): `<your-api-key>`
5. Click **Add secret** and repeat for all 8 keys.

During the GitHub action workflow run, the action pipeline will securely inject these into the Cloudflare build.
