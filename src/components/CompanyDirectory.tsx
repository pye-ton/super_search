import React, { useState, useEffect } from 'react';

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between terminal-glass p-4 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-black text-white tracking-tighter">GLOBAL_INDEX <span className="text-green-500 text-xs">Proprietary DB</span></h2>
        <div className="relative w-full md:w-72">
           <input 
             type="text" 
             placeholder="Search by Company or Sector..." 
             className="w-full bg-black border border-zinc-700 text-white rounded px-4 py-2 text-sm focus:outline-none focus:border-green-500 font-mono"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Market Sector</th>
              <th className="px-6 py-4 text-right">Radar Ping_Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-600 animate-pulse">Initializing Terminal Connection...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-600">0 results found in DB. Run Ingestion API.</td></tr>
            ) : (
              filtered.map((c, i) => (
                <tr key={i} className="hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 font-bold text-zinc-200">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest border border-zinc-700 bg-zinc-900 text-zinc-400 px-2 py-1 rounded">
                      {c.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-500 text-[11px]">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
