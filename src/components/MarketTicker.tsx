import React, { useEffect, useState } from 'react';

const Card = ({ children, className }: any) => <div className={`rounded-xl border shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const Badge = ({ children, className }: any) => (
  <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors ${className || ''}`}>
    {children}
  </div>
);
const ScrollArea = ({ children, className }: any) => <div className={`overflow-auto ${className}`}>{children}</div>;

export default function MarketTicker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Poll the trailing 7-day signals from our Local/D1 database
    fetch('/api/radar')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="border border-zinc-800 bg-black rounded-lg overflow-hidden mb-6 shadow-2xl">
      {/* Target Radar Flashboard (Marquee) */}
      <div className="bg-zinc-950 p-2 border-b border-zinc-800 whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee items-center gap-12">
          {data?.companies?.length > 0 ? data.companies.map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-zinc-200 text-xs font-black">{c.name}</span>
              <Badge className="border-green-500/20 text-green-400 bg-green-500/10">
                {c.sector}
              </Badge>
            </div>
          )) : (
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">Scanning Global DB For Recent Spikes...</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
         {/* Deal/Funding Stream */}
         <Card className="bg-transparent border-none rounded-none border-r border-zinc-800">
           <CardHeader><h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Terminal Signal Feed</span>
              <a href="/signals" className="hover:text-blue-400 cursor-pointer">View All 7-Day &gt;</a>
           </h4></CardHeader>
           <CardContent>
             <ScrollArea className="h-32 custom-scroll">
               {data?.signals?.length > 0 ? data.signals.map((n: any, i: number) => (
                 <div key={i} className="mb-3 border-l-2 border-zinc-700 pl-3">
                   <a href={n.url} target="_blank" className="text-[11px] text-zinc-300 hover:text-blue-400 leading-tight block mb-1 font-mono">
                     {n.title}
                   </a>
                   <div className="flex gap-2 mt-1 items-center">
                     <span className={`text-[8px] border px-1 rounded font-bold uppercase ${n.type.toLowerCase().includes('layoff') ? 'text-red-400 border-red-500/50' : 'text-green-400 border-green-500/50'}`}>
                       {n.type}
                     </span>
                     <span className="text-[8px] text-zinc-600">{new Date(n.timestamp).toLocaleDateString()}</span>
                   </div>
                 </div>
               )) : (
                 <span className="text-xs text-zinc-600 font-mono">Awaiting stream configuration... (Run Ingestion API)</span>
               )}
             </ScrollArea>
           </CardContent>
         </Card>

         {/* Verified Entities Tag Cloud */}
         <Card className="bg-transparent border-none rounded-none bg-zinc-950/30 inset-shadow">
           <CardHeader><h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> VERIFIED ENTITIES (7-DAY)</h4></CardHeader>
           <CardContent>
             <ScrollArea className="h-32 custom-scroll">
               <div className="flex flex-wrap gap-2">
                  {data?.companies?.length > 0 ? Array.from(new Map(data.companies.map((c: any) => [c.name, c])).values()).map((c: any, i: number) => (
                    <div key={i} className="px-2 py-1 bg-black border border-zinc-700/50 rounded-md flex items-center gap-2 hover:border-purple-500/50 transition cursor-default">
                      <span className="text-[10px] font-bold text-zinc-300 tracking-widest">{c.name}</span>
                      <span className="text-[8px] text-purple-400 font-mono bg-purple-500/10 px-1 rounded uppercase">{c.sector}</span>
                    </div>
                  )) : (
                    <span className="text-xs text-zinc-600 font-mono">No entities recorded this week.</span>
                  )}
               </div>
             </ScrollArea>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
