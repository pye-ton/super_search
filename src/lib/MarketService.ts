import { COMPANY_DB } from './CompanyDatabases';

const BASE_URL = 'https://www.alphavantage.co/query';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';
const CACHE_KEY = 'ss_market_data_v3';
const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 Hours

export async function getMarketSignals(alphaKey: string, deepseekKey: string, force = false) {
  const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
  if (cached && !force) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) return data;
  }

  let news: any[] = [];
  let aiInsights = ["DeepSeek Analysis Pending..."];

  // 1. Alpha Vantage News Fetch
  if (alphaKey) {
    try {
      const newsRes = await fetch(`${BASE_URL}?function=NEWS_SENTIMENT&topics=technology&apikey=${alphaKey}`);
      const newsData = await newsRes.json();
      
      // Handle rate limits gracefully
      if (newsData.feed && Array.isArray(newsData.feed)) {
        news = newsData.feed.slice(0, 5);
      } else if (newsData.Information) {
        console.warn('Alpha Vantage Rate Limited');
        news = [{ title: 'RATE LIMIT REACHED. SWITCHING TO AI FALLBACK SIGNAL', url: '#', overall_sentiment_label: 'Neutral', time_published: 'N/A' }];
      }
    } catch (e) {
      console.error("Alpha Vantage Failure:", e);
    }
  }

  // 2. DeepSeek AI Analysis
  if (deepseekKey) {
    try {
      const prompt = `As an elite tech recruiter in 2026, analyze these recent trends: 
      News: ${news.map(n => n.title).join(' | ')}. 
      Also considering companies like Stripe, Databricks, and Anthropic. 
      Output exactly 3 short bullet points (max 10 words each) of top tech hiring signals or startup funding buzz.`;

      const aiRes = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      const aiData = await aiRes.json();
      if (aiData.choices && aiData.choices[0]) {
        aiInsights = aiData.choices[0].message.content.split('\n').filter((l: string) => l.trim().length > 0);
      } else if (aiData.error) {
        aiInsights = [`DeepSeek API Error: ${aiData.error.message}`];
      } else {
        aiInsights = ["DeepSeek analysis unavailable. Utilizing internal target heuristics."];
      }
    } catch (e: any) {
      console.error("DeepSeek Failure:", e);
      aiInsights = [`Error contacting DeepSeek: ${e.message}`];
    }
  } else {
      aiInsights = ["[SYSTEM] DeepSeek API key not detected. Operating in static heuristic mode."];
  }

  // Generate Flashboard from DB
  const spiedCompanies = COMPANY_DB.sort(() => 0.5 - Math.random()).slice(0, 10);

  const result = {
    news: news,
    aiInsights: aiInsights,
    spiedCompanies: spiedCompanies,
    lastUpdated: Date.now()
  };
  
  // Only cache if we got actual data (preventing 'Pending' loops on errors)
  const isHealthy = !aiInsights[0].includes("Pending") && !aiInsights[0].includes("Error") && !aiInsights[0].includes("API key not detected");
  if (isHealthy && typeof localStorage !== 'undefined') {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
  }
  return result;
}
