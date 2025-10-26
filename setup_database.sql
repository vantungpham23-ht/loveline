-- SQL Script để setup database và RLS policies cho Loveline
-- Chạy script này trong Supabase SQL Editor

-- 1. Tạo các bảng nếu chưa có
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID REFERENCES profiles(id),
  user_b_id UUID REFERENCES profiles(id),
  start_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES profiles(id),
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  title TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id),
  uploader_id UUID REFERENCES profiles(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS cho tất cả bảng
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 3. Tạo RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Couples policies
CREATE POLICY "Users can view couples they are part of" ON couples
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can insert couples" ON couples
  FOR INSERT WITH CHECK (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  );

-- Invites policies
CREATE POLICY "Users can view invites they created" ON invites
  FOR SELECT USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invites" ON invites
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update invites they created" ON invites
  FOR UPDATE USING (auth.uid() = inviter_id);

-- Albums policies
CREATE POLICY "Users can view albums of their couples" ON albums
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = albums.couple_id 
      AND (couples.user_a_id = auth.uid() OR couples.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can create albums for their couples" ON albums
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = albums.couple_id 
      AND (couples.user_a_id = auth.uid() OR couples.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can update albums of their couples" ON albums
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM couples 
      WHERE couples.id = albums.couple_id 
      AND (couples.user_a_id = auth.uid() OR couples.user_b_id = auth.uid())
    )
  );

-- Photos policies
CREATE POLICY "Users can view photos in their albums" ON photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums 
      JOIN couples ON couples.id = albums.couple_id
      WHERE albums.id = photos.album_id 
      AND (couples.user_a_id = auth.uid() OR couples.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert photos in their albums" ON photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums 
      JOIN couples ON couples.id = albums.couple_id
      WHERE albums.id = photos.album_id 
      AND (couples.user_a_id = auth.uid() OR couples.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can update photos they uploaded" ON photos
  FOR UPDATE USING (auth.uid() = uploader_id);

-- 4. Tạo storage bucket cho photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Tạo storage policies
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
