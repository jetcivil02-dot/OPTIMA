-- ============================================================================
-- OPTIMA Database Migration
-- Supabase PostgreSQL Schema
-- Version: 1.0.0
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contractor TEXT NOT NULL,
  color TEXT DEFAULT '#0EA5E9',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_teams_active ON teams(active);
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);

-- Insert sample data
INSERT INTO teams (name, contractor, color) VALUES
  ('ทีมเสา-คาน', 'บริษัท สยามคอนกรีต จำกัด', '#0EA5E9'),
  ('ทีมก่ออิฐ', 'บริษัท ช่างก่อ จำกัด', '#10B981'),
  ('ทีมติดตั้งไฟฟ้า', 'ไฟฟ้าสว่าง', '#F59E0B'),
  ('ทีมประปา-สุขาภิบาล', 'ช่างประปาโปร', '#8B5CF6'),
  ('ทีมช่างเหล็ก', 'เหล็กแกร่ง กรุ๊ป', '#EF4444');

-- ============================================================================
-- WORKERS TABLE
-- ============================================================================
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  phone TEXT,
  position TEXT,
  id_card TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_workers_team_id ON workers(team_id);
CREATE INDEX idx_workers_name ON workers(name);
CREATE INDEX idx_workers_active ON workers(active);

-- Insert sample data
INSERT INTO workers (name, team_id, position) VALUES
  ('สมชาย ใจดี', (SELECT id FROM teams WHERE name = 'ทีมเสา-คาน' LIMIT 1), 'หัวหน้าทีม'),
  ('สมศักดิ์ ขยัน', (SELECT id FROM teams WHERE name = 'ทีมเสา-คาน' LIMIT 1), 'ช่างคอนกรีต'),
  ('วิชัย มานะ', (SELECT id FROM teams WHERE name = 'ทีมเสา-คาน' LIMIT 1), 'ช่างเหล็ก'),
  ('ประยุทธ์ สุขสม', (SELECT id FROM teams WHERE name = 'ทีมก่ออิฐ' LIMIT 1), 'หัวหน้าทีม'),
  ('อนุชา รักงาน', (SELECT id FROM teams WHERE name = 'ทีมก่ออิฐ' LIMIT 1), 'ช่างก่ออิฐ'),
  ('สมบัติ ฟ้าใส', (SELECT id FROM teams WHERE name = 'ทีมติดตั้งไฟฟ้า' LIMIT 1), 'ช่างไฟฟ้า');

-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('มา', 'ขาด', 'OT', 'ลา', 'ลาป่วย')),
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(worker_id, date)
);

-- Create indexes
CREATE INDEX idx_attendance_worker_id ON attendance(worker_id);
CREATE INDEX idx_attendance_date ON attendance(date DESC);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_created_at ON attendance(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_attendance_date_status ON attendance(date, status);

-- ============================================================================
-- WORK LOGS TABLE
-- ============================================================================
CREATE TABLE work_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2),
  unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  recorded_by TEXT,
  user_role TEXT CHECK (user_role IN ('staff', 'dev')),
  voice_transcript TEXT,
  photos TEXT[], -- Array of image URLs
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  weather TEXT,
  temperature NUMERIC(4, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_work_logs_date ON work_logs(date DESC);
CREATE INDEX idx_work_logs_created_at ON work_logs(created_at DESC);
CREATE INDEX idx_work_logs_recorded_by ON work_logs(recorded_by);

-- Full text search index for descriptions
CREATE INDEX idx_work_logs_description_search ON work_logs USING GIN (to_tsvector('simple', description));

-- ============================================================================
-- CYCLES TABLE
-- ============================================================================
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  closed_by TEXT,
  closed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  total_workers INTEGER,
  total_work_logs INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one active cycle at a time
CREATE UNIQUE INDEX idx_cycles_active ON cycles(status) WHERE status = 'active';

-- Create indexes
CREATE INDEX idx_cycles_start_date ON cycles(start_date DESC);
CREATE INDEX idx_cycles_status ON cycles(status);

-- Insert initial active cycle
INSERT INTO cycles (start_date, status) VALUES (CURRENT_DATE, 'active');

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'RESET')),
  table_name TEXT NOT NULL,
  record_id UUID,
  user_role TEXT CHECK (user_role IN ('staff', 'dev')),
  user_identifier TEXT,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_user_role ON audit_logs(user_role);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================================
-- SHARED SUMMARIES TABLE (for LINE sharing)
-- ============================================================================
CREATE TABLE shared_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  summary_type TEXT CHECK (summary_type IN ('daily', 'weekly', 'custom')),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  content JSONB NOT NULL,
  image_url TEXT,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shared_by TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_shared_summaries_date_from ON shared_summaries(date_from DESC);
CREATE INDEX idx_shared_summaries_shared_at ON shared_summaries(shared_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_logs_updated_at BEFORE UPDATE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at BEFORE UPDATE ON cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log changes to audit_logs
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (action, table_name, record_id, changes)
  VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_workers AFTER INSERT OR UPDATE OR DELETE ON workers
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_attendance AFTER INSERT OR UPDATE OR DELETE ON attendance
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_work_logs AFTER INSERT OR UPDATE OR DELETE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_cycles AFTER INSERT OR UPDATE OR DELETE ON cycles
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_summaries ENABLE ROW LEVEL SECURITY;

-- Public read access for all (since we're using role-based UI logic)
-- In production, replace with proper authentication policies
CREATE POLICY "Public read access on teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Public read access on workers"
  ON workers FOR SELECT
  USING (true);

CREATE POLICY "Public read access on attendance"
  ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Public read access on work_logs"
  ON work_logs FOR SELECT
  USING (true);

CREATE POLICY "Public read access on cycles"
  ON cycles FOR SELECT
  USING (true);

-- Write policies (staff can insert/update, restrict deletes)
CREATE POLICY "Staff can insert workers"
  ON workers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update workers"
  ON workers FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can manage attendance"
  ON attendance FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can manage work logs"
  ON work_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Dev-only policies for destructive operations
-- Note: In production, add authentication check here
CREATE POLICY "Dev can delete workers"
  ON workers FOR DELETE
  USING (true); -- Replace with auth.uid() check

CREATE POLICY "Dev can manage cycles"
  ON cycles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Dev can view audit logs"
  ON audit_logs FOR SELECT
  USING (true);

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

-- Procedure to close cycle and reset data
CREATE OR REPLACE FUNCTION close_cycle(closed_by_user TEXT)
RETURNS JSON AS $$
DECLARE
  current_cycle_id UUID;
  worker_count INTEGER;
  log_count INTEGER;
  result JSON;
BEGIN
  -- Get current active cycle
  SELECT id INTO current_cycle_id
  FROM cycles
  WHERE status = 'active'
  LIMIT 1;

  IF current_cycle_id IS NULL THEN
    RAISE EXCEPTION 'No active cycle found';
  END IF;

  -- Count data before deletion
  SELECT COUNT(*) INTO worker_count FROM workers;
  SELECT COUNT(*) INTO log_count FROM work_logs;

  -- Update cycle
  UPDATE cycles
  SET 
    status = 'closed',
    end_date = CURRENT_DATE,
    closed_by = closed_by_user,
    closed_at = NOW(),
    total_workers = worker_count,
    total_work_logs = log_count
  WHERE id = current_cycle_id;

  -- Delete all attendance records
  DELETE FROM attendance;

  -- Delete all work logs
  DELETE FROM work_logs;

  -- Delete all workers (will cascade to attendance)
  DELETE FROM workers;

  -- Create new active cycle
  INSERT INTO cycles (start_date, status)
  VALUES (CURRENT_DATE, 'active');

  -- Log the reset action
  INSERT INTO audit_logs (action, table_name, user_identifier, changes)
  VALUES (
    'RESET',
    'system',
    closed_by_user,
    jsonb_build_object(
      'worker_count', worker_count,
      'log_count', log_count,
      'cycle_id', current_cycle_id
    )
  );

  -- Build result
  result := json_build_object(
    'success', true,
    'message', 'Cycle closed successfully',
    'workers_deleted', worker_count,
    'logs_deleted', log_count,
    'old_cycle_id', current_cycle_id
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Procedure to get attendance summary
CREATE OR REPLACE FUNCTION get_attendance_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'date', target_date,
    'total', COUNT(*),
    'present', COUNT(*) FILTER (WHERE status = 'มา'),
    'absent', COUNT(*) FILTER (WHERE status = 'ขาด'),
    'ot', COUNT(*) FILTER (WHERE status = 'OT'),
    'leave', COUNT(*) FILTER (WHERE status IN ('ลา', 'ลาป่วย'))
  ) INTO result
  FROM attendance
  WHERE date = target_date;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Procedure to get work summary by date range
CREATE OR REPLACE FUNCTION get_work_summary(
  date_from DATE DEFAULT CURRENT_DATE,
  date_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', id,
      'description', description,
      'quantity', quantity,
      'unit', unit,
      'date', date,
      'recorded_by', recorded_by,
      'created_at', created_at
    )
    ORDER BY created_at DESC
  ) INTO result
  FROM work_logs
  WHERE date BETWEEN date_from AND date_to;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for attendance with worker and team details
CREATE VIEW attendance_detail AS
SELECT 
  a.id,
  a.date,
  a.status,
  a.check_in_time,
  a.check_out_time,
  a.notes,
  w.id AS worker_id,
  w.name AS worker_name,
  w.position,
  t.id AS team_id,
  t.name AS team_name,
  t.contractor
FROM attendance a
JOIN workers w ON a.worker_id = w.id
JOIN teams t ON w.team_id = t.id
ORDER BY a.date DESC, t.name, w.name;

-- View for work logs summary
CREATE VIEW work_logs_summary AS
SELECT 
  DATE_TRUNC('day', created_at) AS log_date,
  COUNT(*) AS total_logs,
  COUNT(DISTINCT recorded_by) AS unique_recorders,
  SUM(CASE WHEN quantity IS NOT NULL THEN 1 ELSE 0 END) AS logs_with_quantity
FROM work_logs
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY log_date DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE teams IS 'Sub-contractor teams working on the construction site';
COMMENT ON TABLE workers IS 'Individual workers assigned to teams';
COMMENT ON TABLE attendance IS 'Daily attendance records for workers';
COMMENT ON TABLE work_logs IS 'Daily work progress logs with voice transcript support';
COMMENT ON TABLE cycles IS 'Work period tracking for reset functionality';
COMMENT ON TABLE audit_logs IS 'Audit trail for all system changes';

-- ============================================================================
-- GRANTS (for Supabase service role)
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT 'OPTIMA Database Migration Completed Successfully' AS status;
