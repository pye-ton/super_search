# SuperSearch Ingestion Pipeline Automation (CRON)

Your intelligence terminal relies on the `/api/ingest` endpoint to fetch new market signals from your suite of 8 connected APIs (GNews, Finnhub, DeepSeek, etc.) and inject the parsed corporate data directly into your Cloudflare D1 database.

To automate this so the dashboard stays "live," you must set up a Cron Job to automatically trigger this URL periodically.

### Your Target Ingestion URL
Assuming your Cloudflare Pages domain is configured, your target URL to ping will be:
**`https://[YOUR_CLOUDFLARE_DOMAIN].pages.dev/api/ingest`**

---

## Method 1: The Fastest Way (cron-job.org)

This takes 30 seconds to set up, requires no coding, and is 100% free. This is the optimal solution for serverless Next/Astro applications.

1. Go to [cron-job.org](https://cron-job.org/) and create a free account.
2. Click **Create cronjob**.
3. **Title**: SuperSearch Ingestion Engine
4. **URL**: Enter your full Cloudflare Domain URL ending in `/api/ingest`.
5. **Execution schedule**: Choose how often you want the pipeline to run.
   - *Recommendation: Every 6 hours (4 times a day).* Because we implemented randomized API throttling in your code, this will organically cycle through your free limits perfectly.
6. Click **Create**. The external service will now securely trigger your AI engine on schedule!

---

## Method 2: The Developer Way (GitHub Actions)

If you strictly prefer to keep everything inside your GitHub repository infrastructure natively:

1. Inside your remote GitHub repository, click **Add file > Create new file**.
2. Name the file `.github/workflows/cron.yml`
3. Paste the following configuration exactly (replacing your domain string):

```yaml
name: SuperSearch Ingestion Cron

on:
  schedule:
    # Runs at minute 0 every 6 hours (12am, 6am, 12pm, 6pm)
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger from the GitHub UI Actions tab

jobs:
  ping_ingestion_router:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Pipeline
        run: curl -s -X POST https://YOUR-CLOUDFLARE-DOMAIN-HERE.pages.dev/api/ingest
```

4. Click **Commit Details**. GitHub Actions spins up a free micro-server 4 times a day, fires a POST request to your database pipeline, and shuts down automatically!
