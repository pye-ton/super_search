import React, { useState } from 'react';
import JobFilters from './JobFilters';
import { generateAdvancedDork, type FilterState } from '../lib/DorkEngine';

const Button = ({ children, onClick, className, variant, size }: any) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border ${size === 'lg' ? 'h-10 px-8 text-md' : 'h-9 px-4 py-2'} ${variant === 'outline' ? 'border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-zinc-100' : 'border-transparent bg-green-600 text-black shadow hover:bg-green-500'} ${className || ''}`}>
    {children}
  </button>
);

export default function SearchTerminal() {
  const [filters, setFilters] = useState<FilterState>({
    tiers: ['EASY'],
    roles: ['Data Scientist', 'Business Intelligence'],
    levels: [],
    cities: [],
    countries: [],
    timeframe: '24h'
  });

  const dork = generateAdvancedDork(filters);

  return (
    <div className="space-y-6">
      <JobFilters filters={filters} setFilters={setFilters} />

      {/* The "Bloomberg" Terminal Output */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-20 hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black border border-zinc-800 p-6 rounded-lg shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm md:text-xl font-bold text-white tracking-tighter shadow-sm">LIVE_DORK_CONSTRUCTOR</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Query Cost:</span>
               <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-900 ${dork.isSafe ? 'text-green-500 border border-green-500/20' : 'text-red-500 border border-red-500/50'}`}>
                 {dork.length} / 1800 chars
               </span>
            </div>
          </div>
          
          <code className="block bg-zinc-950 p-4 rounded border border-zinc-800 text-green-400 text-xs md:text-sm break-all font-mono leading-relaxed h-32 overflow-y-auto">
            {dork.query || "/* Waiting for parameters to compile dork... */"}
          </code>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <Button size="lg" className="w-full md:w-[70%] bg-green-500 text-black font-black hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]" onClick={() => window.open(dork.url, '_blank')} disabled={!dork.query}>
              LAUNCH RADAR (GOOGLE UDM=14)
            </Button>
            <Button variant="outline" size="lg" className="w-full md:w-[30%] text-white" onClick={() => navigator.clipboard.writeText(dork.query)} disabled={!dork.query}>
              COPY
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
