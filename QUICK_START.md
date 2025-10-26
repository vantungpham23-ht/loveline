# 🚀 Quick Start - Đẩy code lên Git và Deploy

## ✅ Trạng thái hiện tại

- [x] Code đã được kiểm tra
- [x] Build thành công
- [x] Đã commit vào git
- [x] Đã cấu hình cho Cloudflare Pages
- [x] Router đã được chỉnh sang HashRouter (#) cho tương thích CDN
- [x] Environment variables đã được config

## 📝 Bước tiếp theo

### 1️⃣ Tạo GitHub Repository

1. Vào [github.com](https://github.com) và đăng nhập
2. Click **+** → **New repository**
3. Name: `loveline`
4. Click **Create repository**

### 2️⃣ Push code (Chạy trong terminal)

Thay `YOUR_USERNAME` bằng username GitHub của bạn:

```bash
cd /Users/aidenpham/Documents/GitHub/loveline

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/loveline.git

# Push code
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy lên Cloudflare Pages

#### A. Truy cập Cloudflare
- Vào [dash.cloudflare.com](https://dash.cloudflare.com)
- Đăng nhập/đăng ký

#### B. Tạo Pages Project
1. Click **Pages** (sidebar trái)
2. **Create a project** → **Connect to Git**
3. Cho phép Cloudflare truy cập GitHub
4. Chọn repo **loveline**

#### C. Cấu hình Build
- Project name: `loveline`
- Framework: **Vite** (tự động)
- Build command: `npm run build`
- Build output: `dist`

#### D. Thêm Environment Variables (BẮT BUỘC!)

Scroll xuống phần **Environment variables**, thêm 2 biến sau:

**Biến 1**:
- Name: `VITE_SUPABASE_URL`
- Value: `https://hszmtodzutnzpqpjhuxg.supabase.co`

**Biến 2**:
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzem10b2R6dXRuenBxcGpodXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQ2MjUsImV4cCI6MjA3Njk1MDYyNX0.8taC5uxUh1b122KDjWMQtyPWi3-ujBpKBmB9SZas2m4`

#### E. Deploy
1. Click **Save and Deploy**
2. Đợi 2-5 phút
3. Lấy URL: `https://loveline.pages.dev`

## 📚 Tài liệu chi tiết

- **[PUSH_AND_DEPLOY.md](./PUSH_AND_DEPLOY.md)** - Hướng dẫn chi tiết từng bước
- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - Tài liệu kỹ thuật về deploy
- **[README.md](./README.md)** - Tổng quan về dự án

## ⚠️ Lưu ý quan trọng

1. **Environment Variables**: Không được bỏ qua bước add env variables!
2. **Router**: App đã dùng HashRouter (#) thay vì BrowserRouter để tương thích với Cloudflare
3. **Database**: Đảm bảo Supabase database đã được setup (xem DATABASE_SETUP.md)

## 🎯 Kiểm tra sau khi deploy

Sau khi có URL, test các tính năng:
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập
- [ ] Tạo mã mời ghép đôi
- [ ] Upload ảnh
- [ ] Xem bản đồ

## 💡 Tips

- Preview deployments: Mỗi Pull Request sẽ có URL preview riêng
- Instant rollback: Có thể rollback về version trước trong 1 click
- Analytics: Cloudflare Pages có analytics built-in
- Custom domain: Có thể thêm domain tùy chọn sau

---

**Thời gian deploy**: ~5 phút

**Chi phí**: FREE với Cloudflare Pages

**Good luck! 🍀**

