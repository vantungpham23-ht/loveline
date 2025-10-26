-- SQL Script để setup Storage Bucket và RLS policies cho Avatars
-- Chạy script này trong Supabase SQL Editor

-- 1. Tạo storage bucket cho avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Tạo RLS policies cho storage.objects

-- Policy: Cho phép authenticated users upload avatar của chính họ
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Cho phép authenticated users update avatar của chính họ
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Cho phép authenticated users delete avatar của chính họ
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Cho phép mọi người xem avatars (vì bucket là public)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- 3. Enable RLS cho storage.objects (nếu chưa được enable)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
