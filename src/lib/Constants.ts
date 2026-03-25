export const ROLE_GROUPS = {
  "Data Science & AI": [
    "Data Scientist", "Applied Scientist", "ML Engineer", "AI Engineer", 
    "Computer Vision", "NLP Specialist", "AI Research Scientist", "MLOps"
  ],
  "Analytics & Intelligence": [
    "Analytical Engineer", "Product Analyst", "Data Analyst", "Business Intelligence", 
    "BI Analyst", "BI Developer", "Marketing Analyst", "Growth Analyst"
  ],
  "Specialized Ops & SCM": [
    "SCM Analyst", "Supply Chain Data Scientist", "Operations Analyst", 
    "Logistics Data Engineer", "Procurement Analyst", "Business Analyst"
  ],
  "Infrastructure & Cloud": [
    "Cloud Architect", "Platform Engineer", "SRE", "DevOps", "Data Architect"
  ],
  "Software & Platform": [
    "Software Engineer", "Fullstack Developer", "Backend Engineer", 
    "Frontend Engineer", "Site Reliability Engineer"
  ]
};

export const ATS_SEGMENTS = {
  EASY: {
    label: "Quick Apply (1-Page)",
    sites: ['boards.greenhouse.io', 'jobs.lever.co', 'jobs.ashbyhq.com', 'workable.com', 'recruitee.com', 'teamtailor.com']
  },
  MEDIUM: {
    label: "Mid-Tier (Localized)",
    sites: ['bamboohr.com', 'jazzhr.com', 'personio.de', 'personio.ch', 'rippling.com', 'humaans.io', 'pinpoint.ai']
  },
  HARD: {
    label: "Enterprise (Multi-Step)",
    sites: ['myworkdayjobs.com', 'jobs.smartrecruiters.com', 'icims.com', 'taleo.net', 'successfactors.com', 'sirati.bh', 'oraclecloud.com']
  }
};

export const LEVELS = [
  { label: "Intern", query: "Intern OR Internship" },
  { label: "New Grad / Early Career", query: '"New Grad" OR "Recent Grad" OR "University" OR "Early Career" OR "Junior"' },
  { label: "Mid-Level", query: '"L4" OR "L5" OR "Mid-Level" OR "II" OR "III"' },
  { label: "Senior / Staff", query: '"Senior" OR "Sr" OR "Staff" OR "Lead" OR "Principal"' }
];

export const GLOBAL_HUBS = {
  "USA": ['"USA"', '"US"', '"United States"', '"United States of America"'],
  "Canada": ['"Canada"'],
  "UK": ['"UK"', '"United Kingdom"', '"Great Britain"'],
  "Germany": ['"Germany"', '"Deutschland"'],
  "Switzerland": ['"Switzerland"', '"CH"'],
  "UAE": ['"UAE"', '"United Arab Emirates"', '"Dubai"'],
  "Luxembourg": ['"Luxembourg"'],
  "Singapore": ['"Singapore"', '"SG"'],
  "Australia": ['"Australia"', '"AU"']
};
