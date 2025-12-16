# Project IronMind: Build Roadmap

## Timeline Overview

- **MVP (Week 1-2):** Core daily protocol + basic tracking
- **V1 (Week 3-6):** Full features + polish + VANTAGE integration
- **V2 (Week 7-12):** Monetization + advanced AI + integrations

---

## MVP: Weeks 1-2 (Dec 16-29, 2025)

### Goal
**One working user (you) gets daily training plans and can track progress.**

### What We're Building

#### Week 1: Data + Protocol Generation

**Day 1-2: Database Setup**
- ✅ Extend existing SQLite schema
- ✅ Add new tables: `daily_protocols`, `sessions`, `checkins`, `phases`, `progress_snapshots`
- ✅ Create migration script
- ✅ Seed initial athlete profile

**Day 3-4: Protocol Generator Agent**
- Create OpenAI prompt for protocol generation
- Define 8 training phases with periodization rules
- Build phase-specific workout templates
- Generate full 326-day protocol
- Store in database

**Day 5-7: Core API Endpoints**
- `POST /api/protocol/generate` - Generate full plan
- `GET /api/protocol/[date]` - Get specific day
- `POST /api/sessions/complete` - Log completed session
- `POST /api/checkins` - Daily check-in
- `GET /api/progress/graph` - Weekly load data

#### Week 2: UI + Core Experience

**Day 8-10: Today Dashboard**
```
┌─────────────────────────────────────┐
│ YOU ARE HERE                        │
│ Day 1 of 326 • 0.3% Complete        │
│ ════════════════════════════════════│
│                                     │
│ TRANSITION PHASE                    │
│ Week 1, Day 2 • 325 days to race    │
│                                     │
│ TODAY'S SESSIONS                    │
│ ┌─────────────────────────────────┐ │
│ │ 🏃 Easy Run • 30 min            │ │
│ │ Z1-Z2 • 3 miles                 │ │
│ │ [Start Session]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💪 Strength • 30 min            │ │
│ │ Foundation movements            │ │
│ │ [Start Session]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ QUICK CHECK-IN                      │
│ Sleep: ████████░░ 8 hrs             │
│ Mood: ████████░░ 8/10               │
│ Soreness: ████░░░░░░ 4/10           │
│                                     │
│ [View Full Protocol]                │
└─────────────────────────────────────┘
```

**Day 11-12: Progress Graph**
- Weekly load curve visualization
- Phase color bands
- "You are here" marker
- Adherence percentage

**Day 13-14: Session Logging + Polish**
- Quick log modal (< 30 seconds)
- Complete session flow
- Tomorrow preview
- Basic animations

### MVP Success Criteria
- ✅ Generate 326-day protocol in < 3 seconds
- ✅ Open app → see today's plan (< 1 second load)
- ✅ Log workout in < 30 seconds
- ✅ View progress curve with phase colors
- ✅ Daily check-in works
- ✅ VANTAGE can understand "I ran 5 miles today"

### What's NOT in MVP
- ❌ Strava integration
- ❌ Calendar sync
- ❌ Weather adaptation
- ❌ Detailed nutrition planning
- ❌ Social features
- ❌ Gear tracking
- ❌ Advanced AI insights

---

## V1: Weeks 3-6 (Jan 2026)

### Goal
**Production-ready app with full feature set and beautiful UX.**

### Week 3: Enhanced Protocol Intelligence

**Adaptive Protocol System**
- Read check-in data (sleep/mood/soreness)
- Adjust today's workout intensity automatically
- "You slept 5 hours → switching to easy swim"
- Flag overtraining risk

**Protocol Details Expansion**
- Detailed zone breakdowns
- Swim workout structure (warm-up/main/cool-down)
- Bike interval specifics
- Strength exercise library
- Nutrition timing for long workouts

**VANTAGE Integration**
- "Tell me about today's workout" → AI explains the plan
- "I'm feeling tired" → AI adjusts protocol
- "How should I fuel this ride?" → Nutrition guidance
- Voice logging: "I ran 10 miles in 1:25"

### Week 4: Gamification + Motivation

**Streak System**
- Training streak (consecutive days with completed session)
- Check-in streak (consecutive days with data)
- Alcohol-free streak
- Home-cooked meal streak
- Streak recovery (miss 1 day, recover within 3 days)

**Badge System**
- First swim (complete first swim session)
- Century rider (100-mile bike)
- Marathon runner (26.2-mile run)
- Iron legs (complete a week with all sessions)
- Consistency king (30-day streak)
- Distance milestones (500 miles cycled, 100 miles run, 50k yards swim)

**Celebration Animations**
- Confetti on workout complete
- Streak milestone popups
- Badge unlock animations
- Weekly win recap

### Week 5: Analytics + Insights

**Analyst Agent**
- Pattern detection: "You run best on 8+ hours sleep"
- Overtraining detection: "Your resting HR is elevated 3 days in a row"
- Recovery recommendations: "Take an extra rest day this week"
- Performance trends: "Your bike power is up 12% this month"

**Weekly Review Screen**
- Total time trained
- Swim/bike/run/strength breakdown
- Load vs. target
- Adherence rate
- Key insights from AI
- Next week preview

**Dashboard Widgets**
- Training load graph (4-week rolling)
- This week's stats
- Upcoming milestones
- Recent achievements

### Week 6: Polish + Performance

**UI Refinements**
- Smooth transitions between screens
- Skeleton loading states
- Pull-to-refresh
- Haptic feedback
- Dark mode support
- Custom fonts (Inter, SF Pro)

**Performance Optimization**
- Cache protocol data locally
- Offline mode for logging
- Background sync
- Fast app startup (< 500ms)

**User Settings**
- Edit athlete profile
- Adjust weekly hours
- Change long ride day
- Notification preferences
- Export data

### V1 Success Criteria
- ✅ Adaptive protocol based on readiness
- ✅ Complete gamification system
- ✅ AI insights that are actually useful
- ✅ Weekly review that motivates
- ✅ App feels premium and polished
- ✅ VANTAGE fully integrated

---

## V2: Weeks 7-12 (Feb-Mar 2026)

### Goal
**Launch as paid product + advanced features + integrations.**

### Week 7-8: Integrations

**Strava Integration**
- OAuth login
- Auto-import completed activities
- Match to planned sessions
- Sync stats (distance, pace, HR, power)
- Auto-generate Strava post captions

**Calendar Sync**
- Google Calendar / iCal
- Block training time automatically
- Adapt protocol to schedule constraints
- "I have a meeting at 6 AM" → adjust workout time

**Weather Integration**
- Check forecast for long ride day
- Suggest indoor trainer if rain/wind > threshold
- Heat/humidity warnings for race simulation

**Apple Health / Garmin**
- Pull sleep data automatically
- Import resting heart rate
- Track weight trends
- Sync completed workouts

### Week 9: Advanced AI Features

**Nutrition Agent**
- Race day nutrition plan (hour-by-hour)
- Long workout fueling calculator
- Sodium strategy for hot days
- Practice nutrition timeline
- Gut training protocol

**Injury Risk Agent**
- Biomechanics education
- Form cues based on common issues
- "Your run volume jumped 40% → risk flag"
- Recovery protocols for common issues

**Content Agent**
- Turn training logs into:
  - Strava captions (motivational + data)
  - Instagram posts
  - Blog essays
  - Podcast scripts
- "Voice of Jordan" style matching

### Week 10: Monetization

**Free Tier**
- Daily wellness tracker (simple check-in)
- Basic streak tracking
- Lead magnet for paid tiers

**$300/mo Coaching Tier**
- Full daily protocols
- VANTAGE coach access
- Weekly review + feedback
- Adaptive training
- Priority support

**$25,000/yr Transformation Tier**
- Everything in $300 tier
- High-touch accountability
- Weekly video calls
- Custom protocol adjustments
- Race day support
- Access to private community
- Gear sponsorship connections

**Landing Page**
- Conversion-optimized sales page
- Video testimonial from you
- Before/after transformation
- Free trial (7 days)
- Payment integration (Stripe)

### Week 11: Community Features

**Social Feed**
- Share workouts with community
- React to others' sessions (high five)
- Leaderboards (weekly mileage, streaks)
- Training partners (find local athletes)

**Group Challenges**
- "100 Miles in March"
- "30-Day Swim Streak"
- Team competitions

### Week 12: Race Day Features

**Race Week Mode**
- Gear checklist (swim cap, bike pump, nutrition, etc.)
- Travel reminders
- Sleep optimization tips
- Nutrition plan review
- Race day weather forecast
- Taper anxiety management

**Race Day Mode**
- Hour-by-hour execution plan
- Swim/bike/run pacing targets
- Aid station nutrition reminders
- Mental cues for tough moments
- Live GPS tracking (share with family)

**Post-Race**
- Celebration screen
- Share finisher photo
- Recovery protocol (2-4 weeks)
- "What's next?" planning

### V2 Success Criteria
- ✅ 10 paying customers
- ✅ Strava integration working smoothly
- ✅ AI insights genuinely useful
- ✅ Race day mode battle-tested
- ✅ $7,500 MRR ($300/mo × 25 customers)
- ✅ NPS > 50

---

## Technical Stack

### Frontend
- **Framework:** Next.js 16 (React 19) ✅
- **Language:** TypeScript ✅
- **Styling:** Tailwind CSS ✅
- **Animations:** Framer Motion ✅
- **Charts:** Recharts or D3
- **State:** React Context + localStorage
- **Mobile:** PWA (installable)

### Backend
- **Database:** SQLite (local) → PostgreSQL (production) ✅
- **API:** Next.js API Routes ✅
- **AI:** OpenAI GPT-4 ✅
- **Auth:** NextAuth.js (future)
- **Payments:** Stripe (V2)

### Infrastructure
- **Hosting:** Vercel
- **Database:** Neon or Supabase
- **Storage:** AWS S3 (future: activity files)
- **Monitoring:** Vercel Analytics
- **Error Tracking:** Sentry

---

## Development Principles

### 1. Build for One User First
- Everything should work perfectly for you
- Real training days = real feedback
- Don't scale prematurely

### 2. No Friction
- If logging takes > 30 seconds, it's broken
- Default to "just show me today"
- Minimize taps/clicks

### 3. AI Should Feel Magic
- Protocol adapts without asking
- Insights appear at the right time
- Coach knows context

### 4. Visual Excellence
- Apple-liquid-neon aesthetic
- Smooth animations
- Attention to detail

### 5. Sustainable Pace
- You're training for an Ironman while building this
- Ship weekly, not daily
- Rest weeks for code too

---

## Success Metrics

### MVP (Week 2)
- ✅ You use it daily
- ✅ Protocol generates correctly
- ✅ Logging works

### V1 (Week 6)
- ✅ You prefer this to spreadsheets
- ✅ Friends want access
- ✅ No crashes for 7 days

### V2 (Week 12)
- ✅ 10 paying customers
- ✅ $3,000 MRR
- ✅ 90% weekly retention
- ✅ You finish Ironman using this app

---

## Next Actions

### Immediate (Today)
1. Review and approve this roadmap
2. Confirm athlete profile details
3. Set up development environment

### This Week
1. Extend database schema
2. Build protocol generator agent
3. Create phase definitions
4. Generate your 326-day protocol

### This Month
1. Complete MVP
2. Daily use by you
3. Iterate based on real training feedback
4. Prepare for V1 features

---

**Let's build the system that gets you to Ironman Florida. Then we'll scale it to help thousands of others transform.**

Are you ready to start? 🏊‍♂️🚴‍♂️🏃‍♂️
