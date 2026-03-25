# SuperSearchPortal Project Rules
- **Stack:** Astro 5.0 + Tailwind CSS + React (Islands).
- **Architecture:**
  - `DorkEngine.ts`: Pure logic for query construction.
  - `SuperSearchUI`: React island for state management (filters).
- **Constraints:**
  - Max Dork Length: 1,800 characters (Google Safety Limit).
  - No external JS libraries (beyond React/Lucide-React).
  - Use `localStorage` for API keys and Search History.
- **SOLID/DRY:** All ATS URL patterns must be stored in a centralized config object.
