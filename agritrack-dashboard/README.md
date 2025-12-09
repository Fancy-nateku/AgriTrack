# AgriTrack 🌾

**Modern Farm Management & Financial Tracking System**

AgriTrack is a comprehensive web application designed to help farmers manage their farm operations, track finances, plan activities, and generate insightful reports. Built with modern web technologies and optimized for ease of use.

![AgriTrack Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

---

## ✨ Features

### 📊 Financial Management
- **Income Tracking** - Record and categorize farm income from various sources
- **Expense Tracking** - Monitor farm expenses with detailed categorization
- **Dashboard Analytics** - Real-time financial metrics and trends
- **Reports & Insights** - Visual charts and downloadable reports

### 📅 Activity Planning
- **Task Management** - Plan daily, weekly, and monthly farming activities
- **Priority Levels** - Organize tasks by urgency (low, medium, high)
- **Completion Tracking** - Mark tasks as complete and track progress
- **Custom Scheduling** - Set specific dates for activities

### 🔐 User Management
- **Username-Based Authentication** - Simple login without email requirement
- **Multi-Farm Support** - Manage multiple farms from one account
- **Secure Data** - Row-level security ensures data privacy
- **Session Persistence** - Stay logged in across sessions

### 📈 Future Features (Schema Ready)
- Crop Management & Harvest Tracking
- Inventory Management
- Worker & Labor Records
- Daily Farm Notes & Weather Tracking

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - Modern UI library
- **TypeScript 5.8** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **TanStack Query** - Server state management
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Recharts** - Data visualization

### Backend
- **Supabase** - PostgreSQL database & authentication
- **Row Level Security (RLS)** - Database-level authorization
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm (or bun)
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agritrack-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to: **Authentication > Settings**
   - **Disable** "Enable email confirmations"
   - Navigate to: **SQL Editor**
   - Copy and run the entire `supabase/schema.sql` file
   - See `supabase/SCHEMA_MIGRATION.md` for detailed instructions

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

---

## 📁 Project Structure

```
agritrack-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── auth/        # Authentication components
│   │   ├── skeletons/   # Loading skeletons
│   │   └── ...
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   │   └── queries/     # TanStack Query hooks
│   ├── lib/             # Utility functions
│   │   ├── supabaseClient.ts
│   │   └── errorHandler.ts
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Expenses.tsx
│   │   ├── Sales.tsx (Income)
│   │   ├── Reports.tsx
│   │   ├── ActivityPlan.tsx
│   │   └── ...
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── supabase/
│   ├── schema.sql       # Database schema (authoritative)
│   ├── SCHEMA_MIGRATION.md
│   └── archive/         # Old schema files
├── public/              # Static assets
├── .env.example         # Environment variables template
└── package.json
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:8080)

# Production
npm run build            # Build for production
npm run build:dev        # Build in development mode
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

---

## 🔐 Authentication Approach

AgriTrack uses a **username-based authentication system** designed for farmers who may not have email addresses.

### How It Works

1. **User enters username and password** (no email required)
2. **Frontend converts** username to `username@agritrack.local` format internally
3. **Supabase authenticates** with this format (email confirmation disabled)
4. **Profile is created** manually by the frontend with the actual username

This approach provides simple username/password authentication while leveraging Supabase's auth system.

### Security Features

- Row Level Security (RLS) on all database tables
- Users can only access their own data
- Secure password hashing via Supabase
- Session-based authentication

---

## 📊 Database Schema

The database includes the following tables:

### Core Tables (Currently Used)
- `profiles` - User profiles
- `farms` - Farm information
- `expenses` - Expense tracking
- `income` - Income tracking
- `activities` - Activity planning

### Future Feature Tables (Ready to Use)
- `crops` - Crop management
- `inventory` - Inventory tracking
- `workers` - Worker management
- `labor_records` - Labor tracking
- `farm_notes` - Daily farm notes

See `supabase/schema.sql` for the complete schema with inline documentation.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   - Drag and drop to Netlify
   - Or use Netlify CLI: `netlify deploy --prod`

3. **Configure environment variables** in Netlify dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "No such file or directory: package.json"**
- **Solution**: Make sure you're in the `agritrack-dashboard` directory, not the parent `AgriTrack` directory.
  ```bash
  cd agritrack-dashboard
  npm run dev
  ```

**Issue: Authentication errors**
- **Solution**: Ensure email confirmation is disabled in Supabase Dashboard > Authentication > Settings

**Issue: Database errors**
- **Solution**: Verify you've run the complete `supabase/schema.sql` file in your Supabase SQL Editor

**Issue: Data not showing**
- **Solution**: Check browser console for errors. Ensure you've created a farm after signing up.

---

## 📧 Support

For issues and questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Review `supabase/SCHEMA_MIGRATION.md` for database setup
- Open an issue on GitHub

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for farmers everywhere** 🌾
