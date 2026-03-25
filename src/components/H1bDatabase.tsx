import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function H1bDatabase() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sponsorFilter, setSponsorFilter] = useState('All');
  const [fortuneFilter, setFortuneFilter] = useState(false);
  const [publicFilter, setPublicFilter] = useState(false);

  useEffect(() => {
    fetch('/startups_h1b_database.csv')
      .then(r => r.text())
      .then(csvText => {
         Papa.parse(csvText, {
           header: true,
           skipEmptyLines: true,
           complete: (results) => {
             setData(results.data);
             setLoading(false);
           }
         });
      });
  }, []);

  const sectors = ['All', ...Array.from(new Set(data.map(d => d['Business Sector']))).filter(Boolean)].sort() as string[];

  const filtered = data.filter(d => {
    const dName = String(d['Company Name'] || '').toLowerCase();
    const matchSearch = dName.includes(search.toLowerCase());
    const matchSector = sectorFilter === 'All' || d['Business Sector'] === sectorFilter;
    const matchSponsor = sponsorFilter === 'All' || d['H1B Sponsorship Likelihood'] === sponsorFilter;
    const matchFortune = !fortuneFilter || String(d['Fortune 500 (yes/no)']).toLowerCase() === 'yes';
    const matchPublic = !publicFilter || String(d['Publicly traded (Yes/No)']).toLowerCase() === 'yes';
    return matchSearch && matchSector && matchSponsor && matchFortune && matchPublic;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* LEFT SIDEBAR FILTERS */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="terminal-glass p-5 rounded-xl border border-zinc-800 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Search & Filters</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Company Name</label>
            <input 
               type="text" 
               placeholder="Search database..." 
               className="w-full bg-black border border-zinc-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 font-mono"
               value={search}
               onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Business Sector</label>
            <select 
               className="w-full bg-black border border-zinc-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 font-mono appearance-none"
               value={sectorFilter}
               onChange={e => setSectorFilter(e.target.value)}
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">H1B Sponsorship</label>
            <select 
               className="w-full bg-black border border-zinc-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 font-mono appearance-none"
               value={sponsorFilter}
               onChange={e => setSponsorFilter(e.target.value)}
            >
              <option value="All">Any Likelihood</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Medium-High">Medium-High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div className="pt-2 space-y-3 border-t border-zinc-800">
             <label className="flex items-center gap-2 cursor-pointer group">
               <input type="checkbox" className="accent-green-500" checked={fortuneFilter} onChange={e => setFortuneFilter(e.target.checked)} />
               <span className="text-[11px] text-zinc-400 font-mono group-hover:text-white transition">Fortune 500 Only</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer group">
               <input type="checkbox" className="accent-blue-500" checked={publicFilter} onChange={e => setPublicFilter(e.target.checked)} />
               <span className="text-[11px] text-zinc-400 font-mono group-hover:text-white transition">Publicly Traded Only</span>
             </label>
          </div>
        </div>

        <div className="terminal-glass p-5 rounded-xl border border-zinc-800">
           <div className="text-[10px] tracking-widest text-zinc-500 uppercase font-black border-b border-zinc-800 pb-2 mb-2">Metrics Snapshot</div>
           <div className="flex justify-between items-end mt-2">
             <span className="text-xs font-mono text-zinc-400">Total Index</span>
             <span className="text-xl font-black text-white">{data.length}</span>
           </div>
           <div className="flex justify-between items-end mt-1">
             <span className="text-xs font-mono text-green-500">Filtered</span>
             <span className="text-xl font-black text-green-400">{filtered.length}</span>
           </div>
        </div>
      </aside>

      {/* RIGHT MAIN DATA GRID */}
      <main className="flex-1 bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[700px]">
        <div className="overflow-auto custom-scroll flex-1">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest sticky top-0 z-10 shadow-sm border-t-0">
              <tr>
                <th className="px-6 py-4 border-b border-zinc-800">Entity & Careers Portal</th>
                <th className="px-6 py-4 border-b border-zinc-800">Sector</th>
                <th className="px-6 py-4 border-b border-zinc-800">Tags / Focus</th>
                <th className="px-6 py-4 border-b border-zinc-800 text-center">Sponsor Likelihood</th>
                <th className="px-6 py-4 border-b border-zinc-800 text-center">Analyst Pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-600 animate-pulse text-xs uppercase tracking-widest">Hydrating H1B Database Engine...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-600 text-xs uppercase tracking-widest">0 Entities match current permutation.</td></tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-zinc-900/50 transition">
                    <td className="px-6 py-3 font-bold text-zinc-200">
                      <div className="flex items-center gap-2">
                        {String(c['Fortune 500 (yes/no)']).toLowerCase() === 'yes' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" title="Fortune 500"></span>
                        )}
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(c['Company Name'])} "careers" OR "jobs" "greenhouse.io" OR "lever.co" OR "workday" OR "ashbyhq"`} target="_blank" className="hover:text-green-400 transition underline decoration-zinc-700 underline-offset-4 decoration-dashed flex items-center gap-1.5">
                           {c['Company Name']}
                           <svg className="w-2.5 h-2.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest border border-zinc-700 bg-zinc-900 text-zinc-400 px-2 py-1 rounded">
                        {c['Business Sector']}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[11px] text-zinc-500 max-w-[200px] truncate" title={c['Tags']}>
                      {c['Tags']}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-1 rounded ${
                        c['H1B Sponsorship Likelihood'] === 'Very High' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                        c['H1B Sponsorship Likelihood'] === 'High' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                        'text-zinc-400 bg-zinc-800 border-zinc-700'
                      }`}>
                        {c['H1B Sponsorship Likelihood']}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-[10px] text-zinc-300 font-black tracking-widest">
                      {String(c['AnalystsPick (Popular amoung Wallstreet waiting for IPO)']).toLowerCase() === 'yes' ? (
                        <span className="text-green-400 bg-green-500/10 px-2 py-1 rounded">[ YES ]</span>
                      ) : (
                        <span className="text-zinc-600">[ N/A ]</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
