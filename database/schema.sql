-- =============================================================================
-- CODEORBIT SUPABASE DATABASE SCHEMA & SECURITY POLICIES
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. TABLE: profiles
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist on existing installations
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- =============================================================================
-- 2. TABLE: problem_progress
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.problem_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_problem_progress_user_problem UNIQUE(user_id, problem_id)
);

-- =============================================================================
-- 3. TABLE: user_activity
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    problems_solved INTEGER NOT NULL DEFAULT 0,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_activity_user_date UNIQUE(user_id, activity_date)
);

-- =============================================================================
-- 4. TABLE: user_stats
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    stars INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_completed INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 5. TABLE: achievements
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. TABLE: user_achievements
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, achievement_id)
);

-- =============================================================================
-- 7. TABLE: contest_activity
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contest_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contest_id TEXT NOT NULL,
    registered BOOLEAN NOT NULL DEFAULT false,
    registered_at TIMESTAMPTZ,
    participated BOOLEAN NOT NULL DEFAULT false,
    completed BOOLEAN NOT NULL DEFAULT false,
    score INTEGER NOT NULL DEFAULT 0,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_contest_activity_user_contest UNIQUE(user_id, contest_id)
);

-- =============================================================================
-- 8. TABLE: daily_challenges
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL,
    problem_id TEXT NOT NULL,
    challenge_type TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_daily_challenges_unique UNIQUE(user_id, challenge_date, problem_id, challenge_type)
);

-- =============================================================================
-- 9. TABLE: problem_notes
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.problem_notes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    note TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, problem_id)
);

-- =============================================================================
-- 10. TABLE: problem_favorites
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.problem_favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, problem_id)
);

-- =============================================================================
-- 11. TABLE: roadmap_progress
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.roadmap_progress (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    roadmap_node_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, roadmap_node_id)
);

-- =============================================================================
-- 12. TABLE: user_roles (Admin Authorization)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 13. TABLE: problems (Database-Driven Master Problem Management)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    platform TEXT NOT NULL DEFAULT 'LeetCode',
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    phase TEXT DEFAULT 'Foundation',
    section TEXT DEFAULT '01 - Learn the Basics',
    topic TEXT DEFAULT '01 - Learn the Basics',
    subtopic TEXT DEFAULT 'General',
    category TEXT DEFAULT 'General',
    problem_order INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    tags TEXT[] DEFAULT '{}',
    level TEXT DEFAULT 'INTERMEDIATE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 14. TABLE: admin_audit_logs (Administrative Audit Trail)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 15. TABLE: announcements (Live Platform Announcements & Banners)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    link_text TEXT DEFAULT 'View Challenge',
    category TEXT DEFAULT 'General', -- 'Challenge', 'Contest', 'Update', 'General'
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    start_time TIMESTAMPTZ DEFAULT now(),
    end_time TIMESTAMPTZ,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 16. TABLE: contests (Database-Driven Platform Contests)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'LeetCode', -- 'LeetCode', 'CodeChef', 'CodeForces', 'AtCoder', 'GeeksforGeeks', 'Other'
    contest_url TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category TEXT DEFAULT 'MEDIUM',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 17. TABLE: platform_settings (Admin-Configurable Dynamic Platform Rules)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Default Platform Settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('daily_problems_count', '{"count": 3}'::jsonb, 'Number of daily problems automatically generated each day'),
    ('star_rules', '{"daily_problem_stars": 1, "daily_mission_bonus": 1}'::jsonb, 'Rules and reward weights for practice stars'),
    ('streak_rules', '{"grace_period_hours": 24, "min_solves_for_streak": 1}'::jsonb, 'Rules for maintaining learner streaks'),
    ('leaderboard_weights', '{"stars": 10, "streak": 15, "completed": 5, "longest_streak": 5, "active_day": 20}'::jsonb, 'Scoring weights for competitive leaderboard ranking')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_problems_status ON public.problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_platform ON public.problems(platform);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON public.problems(topic);
CREATE INDEX IF NOT EXISTS idx_problems_section ON public.problems(section);
CREATE INDEX IF NOT EXISTS idx_problems_order ON public.problems(problem_order);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_time ON public.announcements(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_contests_status ON public.contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_platform ON public.contests(platform);
CREATE INDEX IF NOT EXISTS idx_contests_start ON public.contests(start_time);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_problem_progress_user ON public.problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_progress_problem ON public.problem_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON public.user_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_activity_user ON public.contest_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_activity_contest ON public.contest_activity(contest_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON public.daily_challenges(user_id, challenge_date);
CREATE INDEX IF NOT EXISTS idx_problem_notes_user ON public.problem_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_favorites_user ON public.problem_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user ON public.roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active_at);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- =============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- Security definer check for Admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Index for fast case-insensitive username lookup
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (LOWER(username));

-- Function to resolve email by username securely for login
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
DECLARE
    v_email TEXT;
BEGIN
    -- 1. Query email by username from public.profiles joined with auth.users
    SELECT u.email INTO v_email
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
    WHERE LOWER(TRIM(p.username)) = LOWER(TRIM(p_username))
    LIMIT 1;

    -- 2. Fallback to raw_user_meta_data in auth.users
    IF v_email IS NULL THEN
        SELECT u.email INTO v_email
        FROM auth.users u
        WHERE LOWER(TRIM(COALESCE(u.raw_user_meta_data->>'username', ''))) = LOWER(TRIM(p_username))
        LIMIT 1;
    END IF;

    RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated, service_role;

-- Trigger to automatically create profile, user role, and user_stats when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    clean_username TEXT;
    display TEXT;
BEGIN
    clean_username := LOWER(TRIM(COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))));
    display := COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', clean_username);

    -- 1. Upsert Profile
    INSERT INTO public.profiles (id, email, username, display_name, avatar_url, created_at, updated_at, last_active_at)
    VALUES (
        NEW.id,
        LOWER(TRIM(NEW.email)),
        clean_username,
        display,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        now(),
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        username = EXCLUDED.username,
        updated_at = now();

    -- 2. Ensure default role ('user')
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;

    -- 3. Ensure baseline User Stats
    INSERT INTO public.user_stats (user_id, stars, current_streak, longest_streak, total_completed, updated_at)
    VALUES (NEW.id, 0, 0, 0, 0, now())
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user warning: %', SQLERRM;
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SECURE COMPETITIVE LEADERBOARD FUNCTION (SECURITY DEFINER)
-- Exposes ONLY public competitive metrics without exposing user_activity metadata.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_competitive_leaderboard(
    p_timeframe TEXT DEFAULT 'all-time',
    p_limit INT DEFAULT 50
)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    stars INT,
    current_streak INT,
    longest_streak INT,
    completed_problems INT,
    active_days INT,
    competitive_score INT,
    rank_number BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
    IF LOWER(TRIM(p_timeframe)) = 'weekly' THEN
        RETURN QUERY
        WITH week_agg AS (
            SELECT
                a.user_id AS agg_user_id,
                COALESCE(SUM(a.problems_solved), 0)::INT AS weekly_problems,
                COALESCE(SUM(a.stars_earned), 0)::INT AS weekly_stars,
                COUNT(DISTINCT a.activity_date)::INT AS weekly_active_days
            FROM public.user_activity a
            WHERE a.activity_date >= date_trunc('week', current_date)::date
              AND a.activity_date <= current_date
            GROUP BY a.user_id
        ),
        scored AS (
            SELECT
                p.id AS s_user_id,
                p.username AS s_username,
                p.display_name AS s_display_name,
                p.avatar_url AS s_avatar_url,
                COALESCE(w.weekly_stars, 0)::INT AS s_stars,
                COALESCE(s.current_streak, 0)::INT AS s_current_streak,
                COALESCE(s.longest_streak, 0)::INT AS s_longest_streak,
                COALESCE(w.weekly_problems, 0)::INT AS s_completed_problems,
                COALESCE(w.weekly_active_days, 0)::INT AS s_active_days,
                (
                    (COALESCE(w.weekly_stars, 0) * 10) +
                    (COALESCE(w.weekly_problems, 0) * 15) +
                    (COALESCE(w.weekly_active_days, 0) * 20)
                )::INT AS s_competitive_score
            FROM public.profiles p
            LEFT JOIN public.user_stats s ON s.user_id = p.id
            JOIN week_agg w ON w.agg_user_id = p.id
            WHERE (COALESCE(w.weekly_problems, 0) > 0 OR COALESCE(w.weekly_stars, 0) > 0 OR COALESCE(w.weekly_active_days, 0) > 0)
        )
        SELECT
            sc.s_user_id AS user_id,
            sc.s_username AS username,
            sc.s_display_name AS display_name,
            sc.s_avatar_url AS avatar_url,
            sc.s_stars AS stars,
            sc.s_current_streak AS current_streak,
            sc.s_longest_streak AS longest_streak,
            sc.s_completed_problems AS completed_problems,
            sc.s_active_days AS active_days,
            sc.s_competitive_score AS competitive_score,
            ROW_NUMBER() OVER (
                ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
            ) AS rank_number
        FROM scored sc
        ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
        LIMIT p_limit;

    ELSIF LOWER(TRIM(p_timeframe)) = 'monthly' THEN
        RETURN QUERY
        WITH month_agg AS (
            SELECT
                a.user_id AS agg_user_id,
                COALESCE(SUM(a.problems_solved), 0)::INT AS monthly_problems,
                COALESCE(SUM(a.stars_earned), 0)::INT AS monthly_stars,
                COUNT(DISTINCT a.activity_date)::INT AS monthly_active_days
            FROM public.user_activity a
            WHERE a.activity_date >= date_trunc('month', current_date)::date
              AND a.activity_date <= current_date
            GROUP BY a.user_id
        ),
        scored AS (
            SELECT
                p.id AS s_user_id,
                p.username AS s_username,
                p.display_name AS s_display_name,
                p.avatar_url AS s_avatar_url,
                COALESCE(m.monthly_stars, 0)::INT AS s_stars,
                COALESCE(s.current_streak, 0)::INT AS s_current_streak,
                COALESCE(s.longest_streak, 0)::INT AS s_longest_streak,
                COALESCE(m.monthly_problems, 0)::INT AS s_completed_problems,
                COALESCE(m.monthly_active_days, 0)::INT AS s_active_days,
                (
                    (COALESCE(m.monthly_stars, 0) * 10) +
                    (COALESCE(m.monthly_problems, 0) * 15) +
                    (COALESCE(m.monthly_active_days, 0) * 20)
                )::INT AS s_competitive_score
            FROM public.profiles p
            LEFT JOIN public.user_stats s ON s.user_id = p.id
            JOIN month_agg m ON m.agg_user_id = p.id
            WHERE (COALESCE(m.monthly_problems, 0) > 0 OR COALESCE(m.monthly_stars, 0) > 0 OR COALESCE(m.monthly_active_days, 0) > 0)
        )
        SELECT
            sc.s_user_id AS user_id,
            sc.s_username AS username,
            sc.s_display_name AS display_name,
            sc.s_avatar_url AS avatar_url,
            sc.s_stars AS stars,
            sc.s_current_streak AS current_streak,
            sc.s_longest_streak AS longest_streak,
            sc.s_completed_problems AS completed_problems,
            sc.s_active_days AS active_days,
            sc.s_competitive_score AS competitive_score,
            ROW_NUMBER() OVER (
                ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
            ) AS rank_number
        FROM scored sc
        ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
        LIMIT p_limit;

    ELSE -- 'all-time'
        RETURN QUERY
        WITH scored AS (
            SELECT
                p.id AS s_user_id,
                p.username AS s_username,
                p.display_name AS s_display_name,
                p.avatar_url AS s_avatar_url,
                COALESCE(s.stars, 0)::INT AS s_stars,
                COALESCE(s.current_streak, 0)::INT AS s_current_streak,
                COALESCE(s.longest_streak, 0)::INT AS s_longest_streak,
                COALESCE(s.total_completed, 0)::INT AS s_completed_problems,
                0::INT AS s_active_days,
                (
                    (COALESCE(s.stars, 0) * 10) +
                    (COALESCE(s.current_streak, 0) * 15) +
                    (COALESCE(s.total_completed, 0) * 5) +
                    (COALESCE(s.longest_streak, 0) * 5)
                )::INT AS s_competitive_score
            FROM public.profiles p
            LEFT JOIN public.user_stats s ON s.user_id = p.id
        )
        SELECT
            sc.s_user_id AS user_id,
            sc.s_username AS username,
            sc.s_display_name AS display_name,
            sc.s_avatar_url AS avatar_url,
            sc.s_stars AS stars,
            sc.s_current_streak AS current_streak,
            sc.s_longest_streak AS longest_streak,
            sc.s_completed_problems AS completed_problems,
            sc.s_active_days AS active_days,
            sc.s_competitive_score AS competitive_score,
            ROW_NUMBER() OVER (
                ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
            ) AS rank_number
        FROM scored sc
        ORDER BY sc.s_competitive_score DESC, sc.s_completed_problems DESC, sc.s_stars DESC, sc.s_user_id ASC
        LIMIT p_limit;

    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_competitive_leaderboard(TEXT, INT) TO anon, authenticated, service_role;

-- =============================================================================
-- SECURE ADMIN USER DELETION FUNCTION (SECURITY DEFINER)
-- Allows verified Admins to permanently delete a user and all child data.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_admin_id UUID;
    v_target_email TEXT;
    v_target_username TEXT;
BEGIN
    v_admin_id := auth.uid();

    -- 1. Authorization check: Executing user MUST be an admin
    IF v_admin_id IS NULL OR NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: Administrator privileges required to delete users.';
    END IF;

    -- 2. Self-deletion protection: Admin cannot delete their own account
    IF target_user_id = v_admin_id THEN
        RAISE EXCEPTION 'Self-deletion prohibited: Platform administrators cannot delete their own account.';
    END IF;

    -- 3. Verify target user exists
    SELECT email INTO v_target_email FROM auth.users WHERE id = target_user_id;
    SELECT username INTO v_target_username FROM public.profiles WHERE id = target_user_id;

    IF v_target_email IS NULL AND v_target_username IS NULL THEN
        RAISE EXCEPTION 'User not found: Target user ID does not exist.';
    END IF;

    -- 4. Record audit log BEFORE deletion
    BEGIN
        INSERT INTO public.admin_audit_logs (
            admin_id,
            action,
            target_type,
            target_id,
            details,
            created_at
        ) VALUES (
            v_admin_id,
            'DELETE_USER',
            'user',
            target_user_id::TEXT,
            jsonb_build_object(
                'email', COALESCE(v_target_email, 'unknown'),
                'username', COALESCE(v_target_username, 'unknown'),
                'deleted_by_admin_id', v_admin_id,
                'timestamp', now()
            ),
            now()
        );
    EXCEPTION WHEN OTHERS THEN
        -- Non-blocking audit log catch as required by spec
        RAISE WARNING 'Admin audit log recording failed: %', SQLERRM;
    END;

    -- 5. Delete from auth.users (cascades to public.profiles, stats, notes, progress, etc.)
    DELETE FROM auth.users WHERE id = target_user_id;

    -- In case profile existed separately without auth cascade, ensure complete profile cleanup
    DELETE FROM public.profiles WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'deleted_user_id', target_user_id,
        'deleted_email', v_target_email,
        'deleted_username', v_target_username,
        'message', 'User and all associated data have been permanently deleted.'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated, service_role;

-- Seed standard achievements baseline
INSERT INTO public.achievements (id, name, description, icon, requirement)
VALUES 
    ('first_solve', 'First Step', 'Solve your very first DSA problem', '🚀', '{"solved": 1}'::jsonb),
    ('streak_7', 'Week Warrior', 'Maintain a 7-day practice streak', '🔥', '{"streak": 7}'::jsonb),
    ('streak_30', 'Monthly Discipline', 'Maintain a 30-day practice streak', '⚡', '{"streak": 30}'::jsonb),
    ('century', 'Century Club', 'Solve 100 DSA problems', '💯', '{"solved": 100}'::jsonb),
    ('stars_50', 'Star Collector', 'Earn 50 Daily Mission Stars', '⭐', '{"stars": 50}'::jsonb),
    ('potd_master', 'POTD Enthusiast', 'Complete 10 Daily Challenges', '🏆', '{"potd": 10}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. profiles: Public read (for leaderboard/display), user update own, admin full
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL USING (public.is_admin());

-- 2. problem_progress: User private, Admin view
DROP POLICY IF EXISTS "Users can manage own problem progress" ON public.problem_progress;
CREATE POLICY "Users can manage own problem progress"
    ON public.problem_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all problem progress" ON public.problem_progress;
CREATE POLICY "Admins can view all problem progress"
    ON public.problem_progress FOR SELECT USING (public.is_admin());

-- 3. user_activity: User private, Admin view
DROP POLICY IF EXISTS "Users can manage own activity" ON public.user_activity;
CREATE POLICY "Users can manage own activity"
    ON public.user_activity FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all user activity" ON public.user_activity;
CREATE POLICY "Admins can view all user activity"
    ON public.user_activity FOR SELECT USING (public.is_admin());

-- 4. user_stats: Viewable for leaderboard, user update own, Admin view all
DROP POLICY IF EXISTS "User stats are viewable for leaderboard" ON public.user_stats;
CREATE POLICY "User stats are viewable for leaderboard"
    ON public.user_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats"
    ON public.user_stats FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user stats" ON public.user_stats;
CREATE POLICY "Admins can manage all user stats"
    ON public.user_stats FOR ALL USING (public.is_admin());

-- 5. achievements: Public viewable, Admin manage
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements are viewable by everyone"
    ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements"
    ON public.achievements FOR ALL USING (public.is_admin());

-- 6. user_achievements: User private & viewable for profile, Admin view
DROP POLICY IF EXISTS "Users can manage own achievements" ON public.user_achievements;
CREATE POLICY "Users can manage own achievements"
    ON public.user_achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "User achievements viewable" ON public.user_achievements;
CREATE POLICY "User achievements viewable"
    ON public.user_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can view all user achievements" ON public.user_achievements;
CREATE POLICY "Admins can view all user achievements"
    ON public.user_achievements FOR SELECT USING (public.is_admin());

-- 7. contest_activity: User private, Admin view
DROP POLICY IF EXISTS "Users can manage own contest activity" ON public.contest_activity;
CREATE POLICY "Users can manage own contest activity"
    ON public.contest_activity FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all contest activity" ON public.contest_activity;
CREATE POLICY "Admins can view all contest activity"
    ON public.contest_activity FOR SELECT USING (public.is_admin());

-- 8. daily_challenges: User private, Admin view
DROP POLICY IF EXISTS "Users can manage own daily challenges" ON public.daily_challenges;
CREATE POLICY "Users can manage own daily challenges"
    ON public.daily_challenges FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all daily challenges" ON public.daily_challenges;
CREATE POLICY "Admins can view all daily challenges"
    ON public.daily_challenges FOR SELECT USING (public.is_admin());

-- 9. problem_notes: Strictly private to user
DROP POLICY IF EXISTS "Users can manage own problem notes" ON public.problem_notes;
CREATE POLICY "Users can manage own problem notes"
    ON public.problem_notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. problem_favorites: Strictly private to user
DROP POLICY IF EXISTS "Users can manage own problem favorites" ON public.problem_favorites;
CREATE POLICY "Users can manage own problem favorites"
    ON public.problem_favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 11. roadmap_progress: User private, Admin view
DROP POLICY IF EXISTS "Users can manage own roadmap progress" ON public.roadmap_progress;
CREATE POLICY "Users can manage own roadmap progress"
    ON public.roadmap_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roadmap progress" ON public.roadmap_progress;
CREATE POLICY "Admins can view all roadmap progress"
    ON public.roadmap_progress FOR SELECT USING (public.is_admin());

-- 12. user_roles: Only users can read their own role; only Admins can manage roles
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role"
    ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
    ON public.user_roles FOR ALL USING (public.is_admin());

-- 13. problems: Public read only published problems, Admin full management
DROP POLICY IF EXISTS "Public can view published problems" ON public.problems;
CREATE POLICY "Public can view published problems"
    ON public.problems FOR SELECT
    USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert problems" ON public.problems;
CREATE POLICY "Admins can insert problems"
    ON public.problems FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update problems" ON public.problems;
CREATE POLICY "Admins can update problems"
    ON public.problems FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete problems" ON public.problems;
CREATE POLICY "Admins can delete problems"
    ON public.problems FOR DELETE
    USING (public.is_admin());

-- 14. admin_audit_logs: Admins only
DROP POLICY IF EXISTS "Admins can manage audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can manage audit logs"
    ON public.admin_audit_logs FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 15. announcements: Public can view active published announcements, Admin full management
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published announcements" ON public.announcements;
CREATE POLICY "Public can view published announcements"
    ON public.announcements FOR SELECT
    USING (
        status = 'published' 
        AND (start_time IS NULL OR start_time <= now())
        AND (end_time IS NULL OR end_time >= now())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements"
    ON public.announcements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 16. contests: Public can view published contests, Admin full management
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published contests" ON public.contests;
CREATE POLICY "Public can view published contests"
    ON public.contests FOR SELECT
    USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage contests" ON public.contests;
CREATE POLICY "Admins can manage contests"
    ON public.contests FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 17. platform_settings: Public read, Admin manage
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.platform_settings;
CREATE POLICY "Settings are viewable by everyone"
    ON public.platform_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage platform settings" ON public.platform_settings;
CREATE POLICY "Admins can manage platform settings"
    ON public.platform_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =============================================================================
-- POSTGRES ROLES SCHEMA & TABLE PERMISSIONS
-- =============================================================================
-- Ensure PostgREST anon and authenticated roles have permission to access schema & tables.
-- (Row-level filtering is still strictly enforced by the RLS policies defined above)

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- =============================================================================
-- ADMIN PROVISIONING SCRIPT FOR EXISTING ACCOUNT
-- =============================================================================
-- Run this in the Supabase SQL Editor to grant admin privileges to your existing account:
-- 
-- Option A: Provision by Email:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = 'YOUR_EMAIL@HERE.COM'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
-- 
-- Option B: Provision by User UUID:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR_USER_UUID_HERE', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

