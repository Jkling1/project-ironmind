# Project IronMind

**365-Day Transformation Protocol for Ironman Training**

A futuristic, minimalist web app designed to track your journey from day one to Ironman race day. Stay motivated with daily tasks, streak tracking, and gamification features.

## Features

### Daily Protocol
- **Fitness Task**: Pull from Ironman training plan or custom input
- **Mindset Task**: Journal prompts, CBT reflections, motivational quotes
- **Growth Task**: Micro-challenges and learning exercises
- **Daily Question**: Track whether you accomplished your goal (Yes/No)

### Mission Control Dashboard
- **Day Counter**: Track your progress (Day X of 365)
- **Countdown Timer**: Days remaining until race day
- **Streak Tracking**: Current and longest streaks
- **Weekly Graph**: Visual representation of last 7 days
- **Progress Bar**: Overall completion percentage
- **Props Button**: Community engagement and self-celebration

### Race Budget Tracker
- **Expense Tracking**: Track all race-related expenses by category
  - Registration fees
  - Gear & equipment
  - Nutrition & supplements
  - Travel & lodging
  - Coaching & training
  - Medical & insurance
  - Other expenses
- **Budget Management**: Set total budget and savings goals
- **Expense Status**: Mark expenses as paid/unpaid
- **Category Breakdown**: Visual breakdown of spending by category
- **Savings Progress**: Track progress toward your savings goal
- **Money Tips**: 18+ actionable tips to earn and save money for racing
  - 8 ways to earn money (sell gear, freelance, volunteer benefits, etc.)
  - 10 ways to save money (buy used, DIY nutrition, early registration, etc.)

### Gamification
- Earn streaks for consecutive days of task completion
- Reflection form triggered when tasks are missed
- Local storage for data persistence

### Design
- Futuristic minimalist aesthetic
- Neon highlight colors (blue, purple, pink, green)
- Responsive design for mobile and desktop
- Dark theme optimized for focus

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project:

```bash
cd project-ironmind
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

On your first visit, you'll see a setup modal where you can configure:
- **Training Start Date**: When you begin your journey
- **Ironman Race Date**: Your target race day

## Usage

### Daily Workflow

1. **Complete Tasks**: Click on each task card to mark it complete
   - Fitness Task (Blue)
   - Mindset Task (Purple)
   - Growth Task (Green)

2. **Answer Daily Question**: Once all tasks are complete, answer "Did you accomplish your goal today?"
   - **Yes**: Builds your streak
   - **No**: Opens reflection form for self-improvement

3. **Track Progress**: View your stats in Mission Control
   - Current streak
   - Longest streak
   - Total days completed
   - Weekly activity graph
   - Overall progress bar

4. **Give Props**: Celebrate your progress by clicking the Props button

### Budget Management Workflow

1. **Switch to Budget View**: Click "Race Budget" tab at the top

2. **Set Your Budget**:
   - Click on the "Total Budget" amount to edit
   - Click on savings amounts to set current savings and goal

3. **Add Expenses**:
   - Click "Add Expense" button
   - Select category, enter name and amount
   - Mark as paid if already purchased
   - Add optional notes

4. **Manage Expenses**:
   - Click checkmark to toggle paid/unpaid status
   - Click trash icon to delete an expense
   - View category breakdown to see where your money goes

5. **Explore Money Tips**:
   - Browse "Earn Money" tips for ways to fund your race
   - Check "Save Money" tips to reduce costs
   - Click on any tip to expand for full details

### Customization

Tasks are automatically generated on a rotating basis. To customize:

- **Fitness Tasks**: Edit `lib/storage.ts` - `fitnessPlans` array
- **Mindset Prompts**: Edit `lib/storage.ts` - `mindsetPrompts` array
- **Growth Challenges**: Edit `lib/storage.ts` - `growthChallenges` array

### Data Storage

All data is stored locally in your browser using `localStorage`. Your progress persists across sessions.

To reset your data:
1. Open browser DevTools
2. Go to Application/Storage tab
3. Clear `localStorage` for this site

## Project Structure

```
project-ironmind/
├── app/
│   ├── globals.css          # Global styles with neon theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── BudgetTracker.tsx     # Budget and expense tracking
│   ├── Header.tsx            # Day counter and countdown
│   ├── MissionControl.tsx    # Main dashboard component
│   ├── MoneyTips.tsx         # Earning and saving tips
│   ├── ReflectionModal.tsx   # Reflection form
│   ├── SetupModal.tsx        # First-time setup
│   ├── StatsPanel.tsx        # Stats and graphs sidebar
│   └── TaskCard.tsx          # Individual task component
├── lib/
│   └── storage.ts            # Data management and localStorage
├── types/
│   └── index.ts              # TypeScript type definitions
└── tailwind.config.ts        # Tailwind theme configuration
```

## Build for Production

```bash
npm run build
npm start
```

## Contributing

This is a personal transformation tool. Feel free to fork and customize for your own journey!

## License

MIT

---

**Your journey to Ironman greatness starts here. Let's go!**
