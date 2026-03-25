import React, { useState } from 'react';
import { generateJobDork } from '../lib/DorkEngine';

// Simulating ShadCN UI components if they are not yet installed
const Card = ({ children, className }: any) => <div className={`rounded-xl border shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Checkbox = ({ checked, onCheckedChange }: any) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-green-500 focus:ring-green-500 max-w-full" />
);
const Button = ({ children, onClick, className, variant }: any) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${variant === 'outline' ? 'border border-input bg-transparent hover:bg-zinc-800 hover:text-zinc-100' : 'bg-primary text-primary-foreground shadow hover:bg-primary/90'} ${className || ''}`}>
    {children}
  </button>
);
const Badge = ({ children, variant, className }: any) => (
  <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'destructive' ? 'border-transparent bg-red-500 text-white shadow hover:bg-red-500/80' : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'} ${className || ''}`}>
    {children}
  </div>
);

export default function SuperSearchUI() {
  const [filters, setFilters] = useState({
    roles: ['SWE', 'SDE', 'Product'],
    levels: ['Early Career', 'New Grad'],
    atsTypes: ['easy'],
    countries: ['USA'],
    cities: [],
    customKeywords: ''
  });

  const dork = generateJobDork(filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-black text-green-400 font-mono min-h-screen">
      {/* Sidebar: Control Panel */}
      <Card className="bg-zinc-900 border-zinc-800 col-span-1">
        <CardHeader><CardTitle className="text-zinc-100">FILTERS</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-500 uppercase">ATS Segments</h4>
            {['easy', 'medium', 'hard'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  checked={filters.atsTypes.includes(type)} 
                  onCheckedChange={(checked: boolean) => {
                    setFilters(f => ({ ...f, atsTypes: checked ? [...f.atsTypes, type] : f.atsTypes.filter(t => t !== type) }))
                  }} 
                />
                <label className="text-sm capitalize text-zinc-300">{type} Apply</label>
              </div>
            ))}
          </div>
          {/* Add more filter sections for Countries/Levels similarly */}
        </CardContent>
      </Card>

      {/* Main: Terminal Output */}
      <div className="col-span-2 space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg overflow-hidden">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-zinc-500">CONSTRUCTED_DORK_QUERY</span>
            <Badge variant={dork.isSafe ? "outline" : "destructive"}>
              {dork.length} / 1800
            </Badge>
          </div>
          <div className="bg-black p-3 rounded border border-green-900/30 break-all text-sm h-32 overflow-y-auto">
            {dork.query}
          </div>
          <div className="mt-4 flex gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-black font-bold"
              onClick={() => window.open(dork.googleUrl, '_blank')}
            >
              EXECUTE ON GOOGLE (UDM=14)
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(dork.query)}>
              COPY TO CLIPBOARD
            </Button>
          </div>
        </div>

        {/* Investment Signal Placeholder */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Market Signals (Free Alpha Vantage)</h4>
          <div className="text-xs text-zinc-400">
             - NASDAQ:TECH [LOADING...] <br/>
             - ALERT: Series C funding detected for 5 SF startups.
          </div>
        </div>
      </div>
    </div>
  );
}
