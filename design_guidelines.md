# TechHive Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Gaming Platform + Modern Dev Tools Hybrid)

**Primary References:**
- Discord: Community structure, chat interfaces, server/channel organization
- Duolingo: Gamification UI, progress tracking, achievement celebration
- Linear: Clean typography, modern aesthetic, information hierarchy
- GitHub: Code/project presentation, collaboration interfaces
- Steam/Epic Games: Arena concepts, user profiles, achievement systems

**Core Principle:** Create an immersive tech gaming experience that balances playful gamification with professional developer credibility. Think "Discord meets Duolingo meets GitHub" - social, educational, and professional.

---

## Typography

**Font Families:**
- Primary: Inter (UI, body text, navigation)
- Display: Space Grotesk (headlines, arena names, clan titles)
- Code: JetBrains Mono (code snippets, terminal)

**Hierarchy:**
- Hero/Arena Titles: text-5xl to text-7xl, font-bold (Space Grotesk)
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl, font-semibold
- Body Text: text-base, font-normal
- Metadata/Stats: text-sm, font-medium
- Code: text-sm (JetBrains Mono)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-8, space-y-12
- Card gaps: gap-4, gap-6
- Margins: m-4, m-8, m-12

**Grid System:**
- Dashboard: 12-column grid (grid-cols-12)
- Arenas Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Leaderboard: Single column with card-based rows
- Project Hub: Masonry-style grid (varying heights)

**Containers:**
- Full dashboard: max-w-7xl mx-auto
- Content areas: max-w-6xl
- Chat/messaging: max-w-4xl
- Modals: max-w-2xl

---

## Component Library

### Navigation & Structure

**Sidebar Navigation (Discord-inspired):**
- Fixed left sidebar (w-64 on desktop, collapsible on mobile)
- Navigation items with icons (Heroicons) + labels
- Active state: subtle gradient background with left border accent
- Sections: Dashboard, Arenas, Communities, Projects, Clans, Profile
- XP bar at bottom of sidebar showing daily progress
- Avatar thumbnail at top with tier badge overlay

**Top Header:**
- Search bar (central, max-w-xl)
- Notification bell with unread count badge
- Quick access: Messages, AI Copilot button, Settings
- User avatar dropdown (right-aligned)

### Dashboard Components

**Stats Cards:**
- Grid layout: 4 cards on desktop (grid-cols-4), 2 on tablet, 1 on mobile
- Each card: Rounded corners (rounded-xl), subtle shadow, padding p-6
- Icon (top-left, w-10 h-10), metric number (text-3xl font-bold), label (text-sm)
- Micro progress bar or trend indicator at bottom

**Progress Trackers:**
- Circular progress rings for skill levels (SVG-based)
- Horizontal bars for XP/daily quests (h-2, rounded-full)
- Stacked bars for multi-skill comparison
- Numbers inside rings for percentage completion

**Activity Feed:**
- Timeline-style layout with left-aligned timestamps
- Cards for each activity: user avatar + action + timestamp
- Hover: subtle lift effect (transform scale-105 transition)
- Infinite scroll with "Load More" trigger

### Gamification Elements

**Arena Cards:**
- Large cards (min-h-64) with gradient overlays
- Background image representing arena theme (blurred, low opacity)
- Arena icon (top-left, w-16 h-16)
- Title (text-2xl font-bold), description (text-sm)
- Stats row: Active Users, Missions Available, Your Rank
- "Enter Arena" CTA button (bottom-right)

**Achievement Badges:**
- Circular or shield-shaped containers (w-20 h-20)
- Icon/illustration centered
- Locked state: grayscale filter with lock icon overlay
- Unlocked: full saturation with subtle glow effect (box-shadow)
- Hover: tooltip showing achievement name + description

**XP/Level Display:**
- Level number in large text (text-4xl) inside bordered circle
- XP bar below: current/total with percentage
- "Level Up" animations reserved for actual level-up moments
- Small "+XP" floating indicators for completed actions

**Leaderboard:**
- Top 3: Larger cards with podium-style visual hierarchy (1st tallest)
- Rows 4+: Compact list with rank number, avatar, username, score
- Your position: highlighted row (sticky when scrolling)
- Filter tabs: Global, Country, State, Age, Skill Category

### Communities & Social

**Community Cards:**
- Horizontal layout: Icon/logo (left), Title + member count (center), Join/Joined button (right)
- Activity indicators: Recent post count, online members (green dot)
- Cover image optional for large communities

**Discussion Threads:**
- List view: Avatar, username, title, preview text (1-2 lines), timestamp, reply count
- Upvote/downvote buttons (left-aligned)
- Tag pills for categories (rounded-full, text-xs, px-3 py-1)

**Chat Interface:**
- Messages: Avatar (left), username + timestamp (top), message bubble (rounded-2xl, max-w-md)
- Code blocks: Dark background, syntax highlighting, copy button
- AI messages: Different avatar, subtle gradient background
- Input box: Fixed bottom, emoji picker, file upload, AI assist button

### Projects & Coding

**Project Cards:**
- Thumbnail/preview image (aspect-ratio-16/9)
- Title, creator avatar + name, tech stack badges
- Stats: Stars, forks, contributors
- Hover: Quick action buttons (View, Fork, Star)

**Code Editor Integration:**
- Split view: File tree (left, w-64), editor (center), terminal/output (bottom)
- Tab system for multiple files
- Line numbers, syntax highlighting
- Collaborative cursors with user avatars
- AI Copilot panel (collapsible right sidebar)

### Learning & Courses

**Mini-Course Cards:**
- Compact cards (w-72) with course icon/illustration
- Duration badge (top-right): "5 min", "10 min"
- Progress bar if started
- Difficulty indicator: Beginner/Intermediate/Advanced chips

**Roadmap Visualization:**
- Vertical timeline with nodes for each milestone
- Completed: filled circle with checkmark
- Current: outlined circle with pulse animation
- Locked: gray circle with lock icon
- Connecting lines between nodes

### Clans & Teams

**Clan Cards:**
- Large card with clan banner image (gradient overlay)
- Clan emblem/logo (centered or top-left)
- Clan name (text-3xl), member count, clan XP
- Role badges for leaders/admins
- "Join" or "Manage" CTA

**Team Formation:**
- Grid of available users/requests
- Filters: Skill, Availability, Interest
- Quick match algorithm suggestions highlighted

### Modals & Overlays

**Skill Assessment Quiz:**
- Full-screen modal with progress indicator (top)
- Question cards (centered, max-w-2xl)
- Multiple choice: Radio buttons with large clickable areas
- "Next" button (bottom-right), "Previous" (bottom-left)
- Results screen: Circular skill radars + assigned tier badge

**Reward Celebrations:**
- Modal overlay (semi-transparent backdrop)
- Centered card with achievement illustration
- Confetti animation (CSS particles, minimal JS)
- XP gained, new badge earned
- "Claim Reward" button

### Forms & Inputs

**Standard Inputs:**
- Height: h-12
- Padding: px-4
- Border: rounded-lg with focus ring
- Labels: text-sm font-medium, mb-2
- Helper text: text-xs below input

**Search:**
- Prominent search bar with icon (left), clear button (right when active)
- Dropdown suggestions: Recent searches, top results
- Keyboard navigation support

---

## Animations (Minimal & Strategic)

**Use Sparingly:**
- Level-up celebrations: Scale + fade-in + confetti
- Achievement unlock: Badge scale-in with glow pulse
- XP gain: "+50 XP" floating number (translate-y animation)
- Loading states: Skeleton screens, not spinners
- Page transitions: Subtle fade (200ms)

**Avoid:**
- Hover animations on every element
- Continuous background animations
- Auto-playing videos in arenas
- Parallax scrolling

---

## Images

**Hero Section:** Full-width hero banner (h-96) with gradient overlay featuring abstract tech/circuit pattern or futuristic workspace illustration. Center-aligned headline + CTA with blurred button backgrounds.

**Arena Backgrounds:** Each arena card needs thematic imagery - AI: neural networks, Cyber: code matrices, Robotics: mechanical arms, etc. Use subtle blur and dark overlay to maintain text readability.

**Profile Avatars:** Default tech-themed avatar options (robot, circuit, pixel art styles) with customization unlocked through achievements.

**Tech News Feed:** Thumbnail images (aspect-ratio-16/9) for articles/updates in discover feed.

**Empty States:** Friendly illustrations for "No projects yet," "Join your first clan," etc.