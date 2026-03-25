import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import { signals as signalsSchema, companies as companiesSchema } from '../../db/schema';
import { XMLParser } from 'fast-xml-parser';

export const ALL: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Cloudflare D1 Binding 'DB' not found." }), { status: 500 });
  }
  const db = drizzle(env.DB);
  
  // Auto-initialize schema for Miniflare local dev proxy
  try {
    import('drizzle-orm').then(async ({ sql }) => {
      await db.run(sql`CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, sector TEXT NOT NULL, created_at INTEGER NOT NULL);`);
      await db.run(sql`CREATE TABLE IF NOT EXISTS signals (id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL, url TEXT NOT NULL, timestamp INTEGER NOT NULL);`);
    });
  } catch (e) {}

  const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_KEY || env.VITE_DEEPSEEK_KEY;
  if (!DEEPSEEK_KEY) return new Response(JSON.stringify({ error: "Missing DeepSeek API Key in environment!" }), { status: 401 });

  let allArticles: any[] = [];
  const parser = new XMLParser();

  // 1. Array of asynchronous fetch pipelines
  const standardApis = [
    // GNews API
    fetch(`https://gnews.io/api/v4/search?q="startup" OR "funding" OR "layoffs" OR "acquisition"&lang=en&country=us&token=${import.meta.env.VITE_GNEWS_KEY}`)
      .then(r => r.json()).then(d => d.articles?.slice(0, 3).map((a:any) => ({ title: a.title, desc: a.description, url: a.url })) || []).catch(() => []),
    // NewsData.io
    fetch(`https://newsdata.io/api/1/latest?apikey=${import.meta.env.VITE_NEWSDATA_KEY}&q=Funding OR Startup OR Layoff OR Acquisition&country=us&language=en&category=technology,business&removeduplicate=1`)
      .then(r => r.json()).then(d => d.results?.slice(0, 3).map((a:any) => ({ title: a.title, desc: a.description, url: a.link })) || []).catch(() => []),
    // The Guardian
    fetch(`https://content.guardianapis.com/search?q=technology AND (funding OR layoff OR acquisition OR startup)&api-key=${import.meta.env.VITE_GUARDIAN_KEY}`)
      .then(r => r.json()).then(d => d.response?.results?.slice(0, 3).map((a:any) => ({ title: a.webTitle, desc: "Guardian Tech News", url: a.webUrl })) || []).catch(() => []),
    // World News API
    fetch(`https://api.worldnewsapi.com/search-news?text=startup OR funding OR layoff&source-countries=us&api-key=${import.meta.env.VITE_WORLDNEWS_KEY}`)
      .then(r => r.json()).then(d => d.news?.slice(0, 3).map((a:any) => ({ title: a.title, desc: a.text?.substring(0, 100), url: a.url })) || []).catch(() => []),
    // Finnhub
    fetch(`https://finnhub.io/api/v1/news?category=general&token=${import.meta.env.VITE_FINNHUB_KEY}`)
      .then(r => r.json()).then(d => d?.slice(0, 3).map((a:any) => ({ title: a.headline, desc: a.summary, url: a.url })) || []).catch(() => []),
    // FMP
    fetch(`https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=3&apikey=${import.meta.env.VITE_FMP_KEY}`)
      .then(r => r.json()).then(d => d?.slice(0, 3).map((a:any) => ({ title: a.title, desc: a.content?.substring(0, 100), url: a.link })) || []).catch(() => [])
  ];

  const rssFeeds = [
    // TechCrunch RSS
    fetch('https://techcrunch.com/feed/')
      .then(r => r.text())
      .then(xml => {
         const obj = parser.parse(xml);
         return obj.rss?.channel?.item?.slice(0, 3).map((a:any) => ({ title: a.title, desc: typeof a.description === 'string' ? a.description.substring(0, 100) : "TechCrunch", url: a.link })) || [];
      }).catch(() => []),
    // VentureBeat RSS
    fetch('https://feeds.feedburner.com/venturebeat/SZYF')
      .then(r => r.text())
      .then(xml => {
         const obj = parser.parse(xml);
         return obj.rss?.channel?.item?.slice(0, 3).map((a:any) => ({ title: a.title, desc: typeof a.description === 'string' ? a.description.substring(0, 100) : "VentureBeat", url: a.link })) || [];
      }).catch(() => [])
  ];

  // Randomly select 2 Premium APIs and 1 RSS feed per cron trigger to aggressively bypass Free Tier API Limits
  const shuffledApis = standardApis.sort(() => 0.5 - Math.random()).slice(0, 2);
  const shuffledRss = rssFeeds.sort(() => 0.5 - Math.random()).slice(0, 1);
  const selectedPromises = [...shuffledApis, ...shuffledRss];

  try {
    const results = await Promise.allSettled(selectedPromises);
    results.forEach(res => {
      if (res.status === 'fulfilled') allArticles.push(...res.value);
    });

    if (allArticles.length === 0) {
      return new Response(JSON.stringify({ message: "All selected data streams returned 0 results. Keys or APIs might be exhausted." }), { status: 200 });
    }

    // Pass max 30 heavily compressed events to DeepSeek (to remain extremely fast and under typical token limits)
    const promptData = allArticles.slice(0, 30).map(a => `[${a.title}](${a.url})`).join(' | ');

    const prompt = `
      You are an elite corporate intelligence agent. 
      Analyze this batched stream of latest tech news headlines/urls: ${promptData}
      
      Extract exactly the Primary Tech Company involved in any headline explicitly representing one of these events: 
      "Funding", "Layoff", "Acquisition", or "Major Deal". Ignore all fluff, advice, or non-corporate events.
      
      Ensure each company strictly maps to one of these safe tracking sectors: "Enterprise SaaS, Fintech, HealthTech, E-commerce, Cloud Infrastructure, AI & Machine Learning, Cybersecurity, Logistics Tech, Web3 & Crypto, Consumer Tech, HR Tech, Data & Analytics".
      
      Return STRICTLY a JSON array. If nothing matches, return []. Format:
      [
        {"companyName": "Stripe", "sector": "Fintech", "type": "Funding", "title": "Stripe raises 1B", "summary": "Stripe adds 1B to warchest...", "url": "https..."}
      ]
      DO NOT INCLUDE markdown like \`\`\`json. DO NOT INCLUDE text outside the brackets.
    `;

    const aiRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.1 })
    });

    const aiData = await aiRes.json();
    if (!aiData.choices || !aiData.choices[0]) {
      return new Response(JSON.stringify({ error: "DeepSeek API failed", logs: aiData }), { status: 500 });
    }

    const rawContent = aiData.choices[0].message.content.trim().replace(/^```json/, '').replace(/```$/, '');
    const extractedEvents = JSON.parse(rawContent);

    let inserted = 0;
    for (const event of extractedEvents) {
      if (event.companyName && event.sector && event.type) {
        try {
          await db.insert(companiesSchema).values({
            name: event.companyName,
            sector: event.sector,
            createdAt: Date.now()
          });
        } catch(e) {}

        await db.insert(signalsSchema).values({
          companyName: event.companyName,
          type: event.type,
          title: event.title,
          summary: event.summary,
          url: event.url,
          timestamp: Date.now()
        });
        inserted++;
      }
    }

    return new Response(JSON.stringify({ message: `Aggregated 7 streams. Analyzed ${allArticles.length} events. Ingested ${inserted} clean signals into DB.` }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
