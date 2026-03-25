# SuperSearchPortal: The Job Seeker Terminal 🌐

## 🎯 Goal
The goal of **SuperSearchPortal** is to create a "Bloomberg Terminal" style, high-end, lightning-fast dashboard that empowers job seekers to uncover "hidden" jobs posted within the last 24 hours across multiple global tech hubs. Constructed for the "Broke Founder," this tool is completely lean, operating well within generous free API tiers (like Alpha Vantage), without compromising aesthetic (Glassmorphism, Neon borders).

## 🚀 Achievements
1. **DorkEngine Logic**: A robust engine that safely constructs advanced Google Dork queries under the 1,800 request-URI limit, bypassing AI overviews using `udm=14` for classic web results. Includes segmentations for Easy, Medium, and Hard ATS systems.
2. **Terminal Aesthetics**: Implementation of a 21st.dev-inspired "Command Center" dashboard, complete with animated tickers, frosted glass cards (`terminal-glass`), and a strict dark-mode-first directive.
3. **Alpha Vantage Tracker**: Custom `localStorage` layer implementing 'stale-while-revalidate' to stretch a 25 req/day API limit into unlimited dashboard refreshes.
4. **Cloudflare Optimizer**: Ultra-lightweight `astro.config.mjs` setup ensuring the app compiles into a static bundle with zero CSS code splits — hosting costs: $0.

## 🛠️ Stack & Dependencies
- **Framework:** Astro 5.0
- **UI & State:** React (Islands Architecture only)
- **Styling:** Tailwind CSS (with arbitrary value capabilities and animations)
- **Deployment Adapter:** `@astrojs/cloudflare`
- **Icons & Components:** Custom logic mimicking ShadCN UI for a dependency-lite build.

## 💻 Installation & Running Locally

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USER/SuperSearchPortal.git
   cd SuperSearchPortal
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321` in your browser.

4. **Environment Variables:**
   Create a `.env` file in the root for API Keys:
   ```env
   VITE_ALPHA_VANTAGE_KEY=your_free_key_here
   ```

## ☁️ Deployment (Cloudflare Pages)

1. Push your code to the `main` branch of your GitHub repository.
   ```bash
   git add .
   git commit -m "feat: SuperSearchPortal v1 Launch"
   git push origin main
   ```
2. In the **Cloudflare Dashboard**:
   - Go to `Workers & Pages` -> `Create application` -> `Pages` -> `Connect to Git`.
   - Select your repo and branch (`main`).
   - Keep framework as `Astro`.
   - Ensure the Command is `npm run build` and Directory is `dist`.
   - Add your `VITE_ALPHA_VANTAGE_KEY` in environment variables.
   - Click **Save and Deploy**.

> Developed with ❤️ by a lean founder and their AI Co-Founder.
