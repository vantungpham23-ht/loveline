# Hướng dẫn Setup Database cho Loveline

## 🚨 Lỗi RLS Policy

Nếu bạn gặp lỗi "new row violates row-level security policy for table 'couples'", đây là cách khắc phục:

## 📋 Cách 1: Chạy SQL Script (Khuyến nghị)

1. **Truy cập Supabase Dashboard**:
   - Đăng nhập vào [supabase.com](https://supabase.com)
   - Chọn project của bạn

2. **Mở SQL Editor**:
   - Vào tab "SQL Editor" trong sidebar
   - Click "New query"

3. **Chạy script setup**:
   - Copy toàn bộ nội dung file `setup_database.sql`
   - Paste vào SQL Editor
   - Click "Run" để thực thi

## 📋 Cách 2: Setup Manual

### 1. Tạo các bảng
```sql
-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Couples
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID REFERENCES profiles(id),
  user_b_id UUID REFERENCES profiles(id),
  start_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invites
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES profiles(id),
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Albums
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  title TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id),
  uploader_id UUID REFERENCES profiles(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Enable RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
```

### 3. Tạo RLS Policies cho Couples
```sql
-- Policy để user có thể xem couples họ tham gia
CREATE POLICY "Users can view couples they are part of" ON couples
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Policy để user có thể tạo couples
CREATE POLICY "Users can insert couples" ON couples
  FOR INSERT WITH CHECK (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  );
```

### 4. Tạo Storage Bucket
```sql
-- Tạo bucket cho photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;
```

## 🔧 Cách 3: Tạm thời tắt RLS (Chỉ cho development)

⚠️ **Cảnh báo**: Chỉ sử dụng cho development, không bao giờ dùng cho production!

```sql
-- Tắt RLS cho couples table (CHỈ CHO DEVELOPMENT)
ALTER TABLE couples DISABLE ROW LEVEL SECURITY;
```

## ✅ Kiểm tra sau khi setup

1. **Test tạo mã mời**: Thử tạo mã mời trong app
2. **Test ghép đôi**: Thử ghép đôi với mã mời
3. **Kiểm tra console**: Không còn lỗi RLS

## 🆘 Nếu vẫn gặp lỗi

1. **Kiểm tra Authentication**: Đảm bảo user đã đăng nhập
2. **Kiểm tra Profile**: Đảm bảo profile đã được tạo
3. **Kiểm tra Console**: Xem lỗi chi tiết trong browser console
4. **Liên hệ Support**: Nếu vẫn không giải quyết được

---

**Lưu ý**: Sau khi setup xong, ứng dụng sẽ hoạt động bình thường và bạn có thể tạo mã mời cũng như ghép đôi thành công!
