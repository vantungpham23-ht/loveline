-- Add user_locations table for storing real-time user positions
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can update their own location
CREATE POLICY "Users can update their own location" ON user_locations
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can insert their own location
CREATE POLICY "Users can insert their own location" ON user_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own location
CREATE POLICY "Users can view their own location" ON user_locations
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can view their partner's location if they're in a couple
CREATE POLICY "Users can view partner location" ON user_locations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_a_id FROM couples WHERE user_b_id = user_locations.user_id
      UNION
      SELECT user_b_id FROM couples WHERE user_a_id = user_locations.user_id
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_updated_at ON user_locations(updated_at);

-- Add trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_user_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_locations_updated_at ON user_locations;
CREATE TRIGGER user_locations_updated_at
BEFORE UPDATE ON user_locations
FOR EACH ROW
EXECUTE FUNCTION update_user_locations_updated_at();
