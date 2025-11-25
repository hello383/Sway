// Comprehensive list of roles organized by category
export const ROLES_BY_CATEGORY: Record<string, string[]> = {
  'Engineering & Development': [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'React Developer',
    'Vue.js Developer',
    'Angular Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'C# Developer',
    'PHP Developer',
    'Ruby Developer',
    'Go Developer',
    'Rust Developer',
    'DevOps Engineer',
    'Site Reliability Engineer (SRE)',
    'Cloud Engineer',
    'Infrastructure Engineer',
    'Security Engineer',
    'QA Engineer',
    'Test Engineer',
    'Automation Engineer',
    'Embedded Systems Engineer',
    'Game Developer',
    'Blockchain Developer',
    'Machine Learning Engineer',
    'AI Engineer',
  ],
  'Data & Analytics': [
    'Data Scientist',
    'Data Analyst',
    'Data Engineer',
    'Business Intelligence Analyst',
    'Analytics Engineer',
    'Data Architect',
    'Statistician',
    'Research Analyst',
    'Business Analyst',
    'Financial Analyst',
    'Market Research Analyst',
  ],
  'Design & Creative': [
    'Product Designer',
    'UI/UX Designer',
    'UX Designer',
    'UI Designer',
    'Graphic Designer',
    'Visual Designer',
    'Interaction Designer',
    'Motion Designer',
    'Brand Designer',
    'Web Designer',
    'Illustrator',
    'Video Editor',
    'Content Creator',
    'Photographer',
    'Creative Director',
    'Art Director',
  ],
  'Product & Management': [
    'Product Manager',
    'Product Owner',
    'Technical Product Manager',
    'Product Marketing Manager',
    'Program Manager',
    'Project Manager',
    'Scrum Master',
    'Agile Coach',
    'Operations Manager',
    'Operations Analyst',
    'Business Operations',
    'Chief of Staff',
  ],
  'Marketing & Growth': [
    'Marketing Manager',
    'Digital Marketing Manager',
    'Content Marketing Manager',
    'Growth Marketing Manager',
    'SEO Specialist',
    'SEM Specialist',
    'PPC Specialist',
    'Social Media Manager',
    'Community Manager',
    'Content Writer',
    'Copywriter',
    'Technical Writer',
    'Content Strategist',
    'Email Marketing Specialist',
    'Marketing Analyst',
    'Brand Manager',
    'Marketing Coordinator',
    'Influencer Marketing Manager',
    'Affiliate Marketing Manager',
  ],
  'Sales & Business Development': [
    'Sales Representative',
    'Account Executive',
    'Sales Manager',
    'Business Development Manager',
    'Business Development Representative',
    'Sales Development Representative (SDR)',
    'Account Manager',
    'Key Account Manager',
    'Customer Success Manager',
    'Customer Success Specialist',
    'Sales Engineer',
    'Inside Sales',
    'Outside Sales',
    'Sales Operations',
    'Revenue Operations',
  ],
  'Customer Support & Success': [
    'Customer Support Specialist',
    'Customer Support Manager',
    'Customer Success Manager',
    'Customer Success Specialist',
    'Technical Support',
    'Help Desk Support',
    'Customer Experience Manager',
  ],
  'HR & People': [
    'HR Manager',
    'HR Business Partner',
    'Recruiter',
    'Technical Recruiter',
    'Talent Acquisition Specialist',
    'People Operations',
    'HR Coordinator',
    'Learning & Development',
    'Compensation & Benefits',
    'HRIS Specialist',
  ],
  'Finance & Accounting': [
    'Finance Manager',
    'Financial Analyst',
    'Accountant',
    'Senior Accountant',
    'Controller',
    'CFO',
    'Bookkeeper',
    'Accounts Payable',
    'Accounts Receivable',
    'Tax Specialist',
    'Auditor',
    'Financial Planner',
  ],
  'Legal & Compliance': [
    'Legal Counsel',
    'Paralegal',
    'Compliance Officer',
    'Privacy Officer',
    'Contract Manager',
  ],
  'Executive & Leadership': [
    'CEO',
    'CTO',
    'COO',
    'CFO',
    'CMO',
    'VP of Engineering',
    'VP of Product',
    'VP of Sales',
    'VP of Marketing',
    'Director of Engineering',
    'Director of Product',
    'Director of Sales',
    'Director of Marketing',
  ],
  'Consulting & Strategy': [
    'Management Consultant',
    'Business Consultant',
    'Strategy Consultant',
    'IT Consultant',
    'Freelance Consultant',
  ],
  'Education & Training': [
    'Technical Trainer',
    'Corporate Trainer',
    'Instructional Designer',
    'Curriculum Developer',
    'Online Course Creator',
  ],
  'Other': [
    'Executive Assistant',
    'Virtual Assistant',
    'Office Manager',
    'Facilities Manager',
    'Event Coordinator',
    'Translator',
    'Interpreter',
    'Researcher',
    'Scientist',
    'Architect',
    'Engineer (Non-Software)',
    'Other',
  ],
}

// Flatten all roles into a single array
export const ALL_ROLES = Object.values(ROLES_BY_CATEGORY).flat().sort()

// Get category for a role
export function getCategoryForRole(role: string): string | null {
  for (const [category, roles] of Object.entries(ROLES_BY_CATEGORY)) {
    if (roles.includes(role)) {
      return category
    }
  }
  return null
}

// Search roles by query (case-insensitive)
export function searchRoles(query: string): string[] {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return ALL_ROLES.filter(role => 
    role.toLowerCase().includes(lowerQuery)
  ).slice(0, 15) // Limit to 15 results
}

// Get roles by category
export function getRolesByCategory(category: string): string[] {
  return ROLES_BY_CATEGORY[category] || []
}

// Get all categories
export function getAllCategories(): string[] {
  return Object.keys(ROLES_BY_CATEGORY)
}

