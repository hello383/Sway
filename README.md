# Sway - Ireland's Remote Job Database

A modern web application connecting Irish professionals with remote job opportunities. Built in partnership with Grow Remote.

## Features

- **Profile Visibility**: Make your profile visible to employers or receive email job alerts
- **Multi-step Signup**: Comprehensive form collecting professional information and preferences
- **Ireland Map Visualization**: See talent distribution across Irish cities
- **Job Listings**: Browse and discover remote job opportunities
- **Email Notifications**: Get notified about matching remote jobs

## Tech Stack

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic design
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Email**: SendGrid (placeholder implementation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hello383/Sway.git
cd Sway
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@sway.ie
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
   - Follow the instructions in `SUPABASE_SETUP.md` to create your Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Sway/
├── app/
│   ├── api/              # API routes
│   │   ├── profiles/     # Profile CRUD operations
│   │   ├── jobs/         # Job posting endpoints
│   │   └── stats/        # Network statistics
│   ├── signup/           # Multi-step signup form
│   ├── success/          # Success/confirmation page
│   ├── jobs/             # Job listings page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── email.ts         # Email service
│   ├── irishTowns.ts    # Irish towns data
│   └── roles.ts         # Job roles data
├── supabase/
│   ├── schema.sql       # Database schema
│   └── enable-rls.sql   # Row Level Security policies
└── package.json
```

## API Endpoints

### Profiles
- `POST /api/profiles` - Create a new profile
- `GET /api/profiles` - List profiles (with optional `?visibility=visible` filter)
- `GET /api/profiles/:id` - Get specific profile
- `PATCH /api/profiles/:id` - Update profile

### Jobs
- `POST /api/jobs` - Create a new job posting
- `GET /api/jobs` - List all jobs
- `POST /api/jobs/:id/notify` - Send job alert to email subscribers

### Stats
- `GET /api/stats` - Get network statistics (professionals, cities, jobs)

## Database Schema

### UserProfile
- Personal information (name, email, phone, location)
- Professional background (role, experience, company, salary)
- Work preferences (hours, communication, retreats, environment)
- Profile visibility (`visible` or `email`)
- Campaign support (optional)

### JobPosting
- Company name, title, description
- Location array, remote type
- Salary range (optional)
- Posted date

## Design System

- **Colors**: Violet (#7c3aed) → Purple (#9333ea) → Fuchsia (#d946ef) gradient
- **Background**: Dark gray-950 with glassmorphic cards
- **Typography**: Bold, large headings with tight tracking
- **Components**: Glassmorphic cards with backdrop blur

## Email Integration

The email service is currently a placeholder. To integrate SendGrid:

1. Get your SendGrid API key
2. Update `.env.local` with your key
3. Implement the email functions in `lib/email.ts` using SendGrid SDK

## Deployment

Build for production:
```bash
npm run build
npm start
```

For deployment on Vercel:
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

## License

ISC

## Partnership

Powered by Grow Remote

