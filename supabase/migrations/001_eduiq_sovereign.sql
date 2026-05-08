-- EduIQ Sovereign Edition schema
-- Shares Supabase project with Sovereign Health OS
-- All tables prefixed with eduiq_ to avoid collision

CREATE TABLE eduiq_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('educator', 'parent', 'admin')),
  school_name TEXT,
  tribal_affiliation TEXT DEFAULT 'Chickasaw Nation',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE eduiq_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  grade TEXT,
  date_of_birth DATE,
  tribal_affiliation TEXT,
  primary_educator_id UUID REFERENCES eduiq_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE eduiq_student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES eduiq_students(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES eduiq_users(id) ON DELETE CASCADE,
  relationship TEXT,
  sms_alerts_enabled BOOLEAN DEFAULT TRUE,
  phone_number TEXT
);

CREATE TABLE eduiq_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES eduiq_students(id) ON DELETE CASCADE,
  observed_by UUID REFERENCES eduiq_users(id),
  -- Behavioral score 0-10
  behavioral_score INTEGER CHECK (behavioral_score BETWEEN 0 AND 10),
  behavioral_notes TEXT,
  -- Academic score 0-10
  academic_score INTEGER CHECK (academic_score BETWEEN 0 AND 10),
  academic_notes TEXT,
  -- Attendance score 0-10 (10 = perfect, 0 = absent/truant)
  attendance_score INTEGER CHECK (attendance_score BETWEEN 0 AND 10),
  attendance_notes TEXT,
  -- Composite early warning score (computed)
  ews_score NUMERIC GENERATED ALWAYS AS (
    (behavioral_score + academic_score + attendance_score)::NUMERIC / 3
  ) STORED,
  observed_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE eduiq_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES eduiq_students(id) ON DELETE CASCADE,
  triggered_by UUID REFERENCES eduiq_users(id),
  alert_level TEXT CHECK (alert_level IN ('watch', 'concern', 'critical')),
  message TEXT,
  sms_sent BOOLEAN DEFAULT FALSE,
  in_app_sent BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE eduiq_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES eduiq_users(id),
  action TEXT NOT NULL,
  resource TEXT,
  resource_id UUID,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE eduiq_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduiq_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduiq_student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduiq_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduiq_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE eduiq_audit_log ENABLE ROW LEVEL SECURITY;

-- Educators see their own students
CREATE POLICY "educators_see_own_students" ON eduiq_students
  FOR SELECT USING (
    primary_educator_id = (
      SELECT id FROM eduiq_users WHERE auth_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY "admins_see_all_students" ON eduiq_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM eduiq_users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Parents see only their linked students
CREATE POLICY "parents_see_linked_students" ON eduiq_students
  FOR SELECT USING (
    id IN (
      SELECT student_id FROM eduiq_student_guardians
      WHERE guardian_id = (
        SELECT id FROM eduiq_users WHERE auth_id = auth.uid()
      )
    )
  );

-- Observations: educators write, admins read all, parents read summaries only
CREATE POLICY "educators_manage_observations" ON eduiq_observations
  FOR ALL USING (
    observed_by = (SELECT id FROM eduiq_users WHERE auth_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM eduiq_users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "parents_read_observations" ON eduiq_observations
  FOR SELECT USING (
    student_id IN (
      SELECT student_id FROM eduiq_student_guardians
      WHERE guardian_id = (
        SELECT id FROM eduiq_users WHERE auth_id = auth.uid()
      )
    )
  );

-- Alerts visible to relevant parties
CREATE POLICY "alerts_visibility" ON eduiq_alerts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM eduiq_users WHERE auth_id = auth.uid() AND role = 'admin')
    OR triggered_by = (SELECT id FROM eduiq_users WHERE auth_id = auth.uid())
    OR student_id IN (
      SELECT student_id FROM eduiq_student_guardians
      WHERE guardian_id = (SELECT id FROM eduiq_users WHERE auth_id = auth.uid())
    )
  );

-- Audit log: admins only
CREATE POLICY "admins_read_audit" ON eduiq_audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM eduiq_users WHERE auth_id = auth.uid() AND role = 'admin')
  );
