-- =====================================================
-- CODEVERSE SUPABASE MIGRATION
-- Optimized for High Load & Performance
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- =====================================================
-- SESSION STORAGE (for authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  pen_name VARCHAR,
  profile_image_url VARCHAR,
  profile_setup_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- USER PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interests TEXT[] DEFAULT '{}',
  tech_tier VARCHAR DEFAULT 'Beginner',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  learning_pace VARCHAR DEFAULT 'moderate',
  cognitive_style VARCHAR DEFAULT 'visual',
  country VARCHAR,
  age_group VARCHAR,
  bio TEXT,
  avatar_style VARCHAR DEFAULT 'default',
  avatar_aura VARCHAR DEFAULT 'none',
  badges TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  skill_scores JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  current_roadmap VARCHAR,
  daily_streak INTEGER DEFAULT 0,
  total_challenges_completed INTEGER DEFAULT 0,
  total_projects_created INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tech_tier ON user_profiles(tech_tier);

-- =====================================================
-- ARENAS (Skill Learning Areas)
-- =====================================================
CREATE TABLE IF NOT EXISTS arenas (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR,
  color VARCHAR,
  image_url VARCHAR,
  category VARCHAR NOT NULL,
  difficulty VARCHAR DEFAULT 'all',
  active_users INTEGER DEFAULT 0,
  total_missions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_arenas_category ON arenas(category);
CREATE INDEX IF NOT EXISTS idx_arenas_difficulty ON arenas(difficulty);
CREATE INDEX IF NOT EXISTS idx_arenas_slug ON arenas(slug);

-- =====================================================
-- CHALLENGES (Arena Missions)
-- =====================================================
CREATE TABLE IF NOT EXISTS challenges (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  arena_id VARCHAR REFERENCES arenas(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  difficulty VARCHAR DEFAULT 'beginner',
  xp_reward INTEGER DEFAULT 50,
  time_limit INTEGER,
  type VARCHAR DEFAULT 'coding',
  instructions TEXT,
  starter_code TEXT,
  test_cases JSONB,
  hints TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_daily BOOLEAN DEFAULT false,
  is_weekly BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenges_arena_id ON challenges(arena_id);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_is_daily ON challenges(is_daily) WHERE is_daily = true;
CREATE INDEX IF NOT EXISTS idx_challenges_is_weekly ON challenges(is_weekly) WHERE is_weekly = true;
CREATE INDEX IF NOT EXISTS idx_challenges_tags ON challenges USING GIN(tags);

-- =====================================================
-- USER CHALLENGES (Progress Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_challenges (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id VARCHAR NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'not_started',
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  submitted_code TEXT,
  completed_at TIMESTAMP,
  started_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_challenges_unique ON user_challenges(user_id, challenge_id);

-- =====================================================
-- PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  language VARCHAR,
  tech_stack TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  thumbnail VARCHAR,
  repo_url VARCHAR,
  live_url VARCHAR,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_projects_stars ON projects(stars DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_projects_title_search ON projects USING GIN(to_tsvector('english', title));

-- =====================================================
-- PROJECT COLLABORATORS
-- =====================================================
CREATE TABLE IF NOT EXISTS project_collaborators (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id VARCHAR NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'contributor',
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_collaborators_unique ON project_collaborators(project_id, user_id);

-- =====================================================
-- CLANS (Tech Communities)
-- =====================================================
CREATE TABLE IF NOT EXISTS clans (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  description TEXT,
  leader_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banner_image VARCHAR,
  emblem VARCHAR,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  focus TEXT[] DEFAULT '{}',
  type VARCHAR DEFAULT 'interest',
  project_goal TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clans_leader_id ON clans(leader_id);
CREATE INDEX IF NOT EXISTS idx_clans_is_public ON clans(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_clans_xp ON clans(xp DESC);
CREATE INDEX IF NOT EXISTS idx_clans_type ON clans(type);

-- =====================================================
-- CLAN MEMBERS
-- =====================================================
CREATE TABLE IF NOT EXISTS clan_members (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clan_id VARCHAR NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member',
  xp_contributed INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clan_members_clan_id ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_user_id ON clan_members(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clan_members_unique ON clan_members(clan_id, user_id);

-- =====================================================
-- QUESTS
-- =====================================================
CREATE TABLE IF NOT EXISTS quests (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL,
  xp_reward INTEGER DEFAULT 25,
  requirement JSONB,
  icon VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quests_is_active ON quests(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(type);

-- =====================================================
-- USER QUESTS (Progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_quests (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id VARCHAR NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  assigned_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_quest_id ON user_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_is_completed ON user_quests(is_completed);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_quests_unique ON user_quests(user_id, quest_id);

-- =====================================================
-- COURSES
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 10,
  difficulty VARCHAR DEFAULT 'beginner',
  category VARCHAR,
  icon VARCHAR,
  content JSONB,
  xp_reward INTEGER DEFAULT 100,
  enrollments INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);

-- =====================================================
-- USER COURSES (Progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  started_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_courses_unique ON user_courses(user_id, course_id);

-- =====================================================
-- MESSAGES (Direct Messaging)
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- =====================================================
-- FEED ITEMS (TechPulse)
-- =====================================================
CREATE TABLE IF NOT EXISTS feed_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  source VARCHAR,
  source_url VARCHAR,
  image_url VARCHAR,
  category VARCHAR,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feed_items_category ON feed_items(category);
CREATE INDEX IF NOT EXISTS idx_feed_items_created_at ON feed_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_items_likes ON feed_items(likes DESC);
CREATE INDEX IF NOT EXISTS idx_feed_items_tags ON feed_items USING GIN(tags);

-- =====================================================
-- ROADMAPS
-- =====================================================
CREATE TABLE IF NOT EXISTS roadmaps (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR,
  difficulty VARCHAR DEFAULT 'beginner',
  estimated_weeks INTEGER DEFAULT 12,
  milestones JSONB,
  skills TEXT[] DEFAULT '{}',
  icon VARCHAR,
  color VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_roadmaps_slug ON roadmaps(slug);
CREATE INDEX IF NOT EXISTS idx_roadmaps_category ON roadmaps(category);
CREATE INDEX IF NOT EXISTS idx_roadmaps_difficulty ON roadmaps(difficulty);

-- =====================================================
-- USER ROADMAPS (Progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roadmaps (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id VARCHAR NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  current_milestone INTEGER DEFAULT 0,
  completed_milestones INTEGER[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user_id ON user_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_roadmap_id ON user_roadmaps(roadmap_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roadmaps_unique ON user_roadmaps(user_id, roadmap_id);

-- =====================================================
-- LEADERBOARD ENTRIES (Cached)
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  period VARCHAR DEFAULT 'all_time',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON leaderboard_entries(category);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_entries(period);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_entries(rank);
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_unique ON leaderboard_entries(user_id, category, period);

-- =====================================================
-- AI CHATS (Copilot History)
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_chats (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  context VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_created_at ON ai_chats(created_at DESC);

-- =====================================================
-- COMPETITIONS & HACKATHONS
-- =====================================================
CREATE TABLE IF NOT EXISTS competitions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL,
  arena_id VARCHAR REFERENCES arenas(id) ON DELETE SET NULL,
  status VARCHAR DEFAULT 'upcoming',
  prize_pool INTEGER DEFAULT 0,
  max_participants INTEGER,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  difficulty VARCHAR DEFAULT 'intermediate',
  rules TEXT,
  prizes JSONB,
  participant_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_by VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_start_date ON competitions(start_date);
CREATE INDEX IF NOT EXISTS idx_competitions_end_date ON competitions(end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_created_by ON competitions(created_by);
CREATE INDEX IF NOT EXISTS idx_competitions_tags ON competitions USING GIN(tags);

-- =====================================================
-- COMPETITION PARTICIPANTS
-- =====================================================
CREATE TABLE IF NOT EXISTS competition_participants (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  competition_id VARCHAR NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_name VARCHAR,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  submission_url VARCHAR,
  submitted_at TIMESTAMP,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_competition_participants_competition_id ON competition_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_user_id ON competition_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_score ON competition_participants(score DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_competition_participants_unique ON competition_participants(competition_id, user_id);

-- =====================================================
-- COMPETITION LEADERBOARD (Cached)
-- =====================================================
CREATE TABLE IF NOT EXISTS competition_leaderboard (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  competition_id VARCHAR NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  xp_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_competition_leaderboard_competition_id ON competition_leaderboard(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_leaderboard_rank ON competition_leaderboard(rank);
CREATE UNIQUE INDEX IF NOT EXISTS idx_competition_leaderboard_unique ON competition_leaderboard(competition_id, user_id);

-- =====================================================
-- PERFORMANCE OPTIMIZATION FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_chats_updated_at BEFORE UPDATE ON ai_chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (true); -- Public read for user discovery

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- User profiles
CREATE POLICY user_profiles_select_all ON user_profiles
  FOR SELECT USING (true); -- Public read for leaderboards

CREATE POLICY user_profiles_insert_own ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY user_profiles_update_own ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Projects
CREATE POLICY projects_select_public ON projects
  FOR SELECT USING (is_public = true OR user_id = auth.uid()::text);

CREATE POLICY projects_insert_own ON projects
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY projects_update_own ON projects
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY projects_delete_own ON projects
  FOR DELETE USING (auth.uid()::text = user_id);

-- Messages
CREATE POLICY messages_select_own ON messages
  FOR SELECT USING (
    auth.uid()::text = sender_id OR 
    auth.uid()::text = receiver_id
  );

CREATE POLICY messages_insert_own ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

-- AI Chats
CREATE POLICY ai_chats_select_own ON ai_chats
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY ai_chats_insert_own ON ai_chats
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY ai_chats_update_own ON ai_chats
  FOR UPDATE USING (auth.uid()::text = user_id);

-- =====================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =====================================================

-- Top users by XP (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS top_users_by_xp AS
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.pen_name,
  u.profile_image_url,
  up.xp,
  up.level,
  up.tech_tier,
  up.badges,
  up.achievements,
  ROW_NUMBER() OVER (ORDER BY up.xp DESC) as rank
FROM users u
JOIN user_profiles up ON u.id = up.user_id
ORDER BY up.xp DESC
LIMIT 100;

CREATE UNIQUE INDEX IF NOT EXISTS idx_top_users_by_xp_id ON top_users_by_xp(id);

-- Active competitions
CREATE MATERIALIZED VIEW IF NOT EXISTS active_competitions AS
SELECT 
  c.*,
  u.first_name || ' ' || u.last_name as creator_name,
  COUNT(cp.id) as current_participants
FROM competitions c
JOIN users u ON c.created_by = u.id
LEFT JOIN competition_participants cp ON c.id = cp.competition_id
WHERE c.status = 'active'
GROUP BY c.id, u.first_name, u.last_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_active_competitions_id ON active_competitions(id);

-- =====================================================
-- VACUUM AND ANALYZE FOR OPTIMIZATION
-- =====================================================
VACUUM ANALYZE;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on all tables to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant insert/update/delete on specific tables
GRANT INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT INSERT, UPDATE, DELETE ON messages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ai_chats TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Then update your DATABASE_URL in environment variables
