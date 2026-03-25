import React from 'react';
import { ROLE_GROUPS, ATS_SEGMENTS, LEVELS, GLOBAL_HUBS } from '../lib/Constants';
import type { FilterState } from '../lib/DorkEngine';

// Simulating ShadCN Components
const Checkbox = ({ id, checked, onCheckedChange }: any) => (
  <input 
    type="checkbox" 
    id={id}
    checked={checked} 
    onChange={(e) => onCheckedChange(e.target.checked)} 
    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-green-500 focus:ring-green-500 cursor-pointer" 
  />
);
const Badge = ({ children, variant, className, onClick }: any) => (
  <div 
    onClick={onClick} 
    className={`inline-flex items-center justify-center rounded-md px-2.5 py-0.5 font-semibold transition-colors focus:outline-none border select-none ${variant === 'default' ? 'bg-green-600 text-black border-transparent hover:bg-green-500' : 'bg-transparent text-zinc-400 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-800'} ${className || ''}`}
  >
    {children}
  </div>
);
const ScrollArea = ({ children, className }: any) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
);

interface JobFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function JobFilters({ filters, setFilters }: JobFiltersProps) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 terminal-glass border border-zinc-800/60 rounded-xl mb-6 shadow-2xl">
      {/* 1. ATS Segmentation Selector */}
      <div className="space-y-4">
        <h4 className="text-[10px] text-green-500 font-bold uppercase tracking-widest border-b border-green-500/20 pb-1">Application Tier</h4>
        <div className="flex flex-col gap-2">
          {Object.entries(ATS_SEGMENTS).map(([key, data]) => (
            <div key={key} className={`flex items-center space-x-3 border p-2 rounded transition-all duration-200 ${filters.tiers.includes(key as any) ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50'}`}>
              <Checkbox 
                id={key}
                checked={filters.tiers.includes(key as any)}
                onCheckedChange={(checked: boolean) => {
                  const newTiers = checked 
                    ? [...filters.tiers, key as any] 
                    : filters.tiers.filter(k => k !== key);
                  setFilters({ ...filters, tiers: newTiers });
                }}
              />
              <label htmlFor={key} className="text-xs text-zinc-300 cursor-pointer flex-1 font-medium">{data.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Advanced Role Selector */}
      <div className="space-y-4 lg:col-span-2">
        <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-widest border-b border-blue-400/20 pb-1 flex justify-between">
          <span>Target Operations</span>
          {filters.roles.length > 0 && <span className="text-zinc-500 lowercase">{filters.roles.length} selected</span>}
        </h4>
        <ScrollArea className="h-[220px] pr-4 space-y-5 custom-scroll">
          {Object.entries(ROLE_GROUPS).map(([group, roles]) => (
            <div key={group}>
              <p className="text-[9px] text-zinc-500 font-bold mb-2 uppercase tracking-wide">{group}</p>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <Badge 
                    key={role}
                    variant={filters.roles.includes(role) ? "default" : "outline"}
                    className="cursor-pointer text-[10px]"
                    onClick={() => {
                      const newRoles = filters.roles.includes(role) 
                        ? filters.roles.filter(r => r !== role) 
                        : [...filters.roles, role];
                      setFilters({ ...filters, roles: newRoles });
                    }}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* 3. Level & Timeframe & Location */}
      <div className="space-y-4 lg:col-span-3 pt-4 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Levels */}
        <div>
          <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-3">Seniority Level</h4>
          <select 
            className="w-full bg-black border border-zinc-800 text-xs text-zinc-300 p-2 rounded focus:border-purple-500 outline-none"
            value={filters.levels.length > 0 ? filters.levels[0] : ""}
            onChange={(e) => setFilters({ ...filters, levels: e.target.value ? [e.target.value] : [] })}
          >
            <option value="">All Levels</option>
            {LEVELS.map(lvl => (
               <option key={lvl.label} value={lvl.query}>{lvl.label}</option>
            ))}
          </select>
        </div>

        {/* Global Hubs */}
        <div>
          <h4 className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-3">Global Hubs</h4>
          <select 
            className="w-full bg-black border border-zinc-800 text-xs text-zinc-300 p-2 rounded focus:border-yellow-500 outline-none"
            value={filters.countries.length > 0 ? filters.countries[0] : ""}
            onChange={(e) => setFilters({ ...filters, countries: e.target.value ? [e.target.value] : [], cities: [] })}
          >
            <option value="">Global Search</option>
            {Object.keys(GLOBAL_HUBS).map(region => (
               <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <h4 className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-3">Freshness (Index Delay)</h4>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {[ { v: '24h', l: '24H' }, { v: '3d', l: '3D' }, { v: '7d', l: '7D' }, { v: 'all', l: 'All' }].map(t => (
              <Badge
                key={t.v}
                variant={filters.timeframe === t.v ? "default" : "outline"}
                className={`cursor-pointer ${filters.timeframe === t.v ? '!bg-cyan-600' : 'hover:!text-cyan-400'} text-[10px] py-1.5`}
                onClick={() => setFilters({ ...filters, timeframe: t.v })}
              >
                {t.l}
              </Badge>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
