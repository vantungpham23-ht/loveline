# Hướng dẫn Deploy Loveline lên Cloudflare Pages

## 📋 Yêu cầu trước khi deploy

1. Tài khoản Cloudflare (miễn phí)
2. GitHub account
3. Repository code đã được push lên GitHub

## 🚀 Các bước deploy

### Bước 1: Push code lên GitHub

```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Add tất cả các files
git add .

# Commit
git commit -m "Initial commit: Loveline app"

# Tạo repository trên GitHub (truy cập github.com -> New repository)
# Lấy URL của repository (ví dụ: https://github.com/yourusername/loveline.git)

# Add remote và push
git remote add origin https://github.com/yourusername/loveline.git
git branch -M main
git push -u origin main
```

### Bước 2: Connect với Cloudflare Pages

1. **Đăng nhập Cloudflare**: Truy cập [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Chọn Pages**: Vào mục "Pages" ở sidebar bên trái

3. **Tạo project mới**: Click "Create a project" → "Connect to Git"

4. **Authorize GitHub**: Cho phép Cloudflare truy cập GitHub repository của bạn

5. **Chọn repository**: Chọn repository "loveline" của bạn

6. **Cấu hình build settings**:
   - **Project name**: `loveline`
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

7. **Environment variables** (QUAN TRỌNG):
   
   Add các biến môi trường sau:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://hszmtodzutnzpqpjhuxg.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzem10b2R6dXRuenBxcGpodXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQ2MjUsImV4cCI6MjA3Njk1MDYyNX0.8taC5uxUh1b122KDjWMQtyPWi3-ujBpKBmB9SZas2m4` |
   
   **Cách thêm**: Scroll xuống phần "Environment Variables" → Add variable → Nhập name và value → Save

8. **Build settings nâng cao** (không bắt buộc):
   - Root directory: `/` (để trống)
   - Build command: `npm run build`
   - Build output directory: `dist`

### Bước 3: Deploy

1. Click "Save and Deploy"

2. Cloudflare sẽ tự động:
   - Clone repository
   - Install dependencies (`npm install`)
   - Run build command
   - Deploy to CDN

3. Chờ 2-5 phút để build hoàn tất

4. Sau khi deploy thành công, bạn sẽ nhận được URL:
   - Production: `https://loveline.pages.dev` (hoặc custom domain nếu bạn setup)
   - Preview: URL cho từng PR

### Bước 4: Tùy chọn - Custom Domain

1. Vào Pages project → Custom domains

2. Thêm domain của bạn (ví dụ: `loveline.yourdomain.com`)

3. Cloudflare sẽ tự động setup DNS và SSL

4. Đợi SSL active (thường vài phút)

## 🎯 Cấu hình quan trọng

### 1. SPA Routing

Ứng dụng sử dụng HashRouter để tương thích với Cloudflare Pages CDN mà không cần redirect rules phức tạp.

### 2. Environment Variables

Bắt buộc phải add environment variables trong Cloudflare Pages settings để:
- Kết nối với Supabase
- Authentication hoạt động đúng
- Database queries hoạt động

### 3. Build Settings

```yaml
Framework: Vite
Build command: npm run build
Output directory: dist
Node version: 18+ (Cloudflare sẽ tự detect)
```

## 🔄 Continuous Deployment

Cloudflare Pages tự động:
- **Deploy lại mỗi khi push lên main branch**
- **Tạo preview cho mỗi Pull Request**
- **Rollback về version trước nếu deploy fail**

## 📝 Quy trình làm việc

```bash
# 1. Local development
npm run dev

# 2. Commit changes
git add .
git commit -m "Your changes"

# 3. Push to GitHub
git push origin main

# 4. Cloudflare tự động deploy (2-5 phút)
```

## 🐛 Troubleshooting

### Build fails

1. Check build locally: `npm run build` có chạy OK?
2. Check logs trong Cloudflare Pages dashboard
3. Đảm bảo environment variables đã được add

### App không load được

1. Check browser console để xem lỗi
2. Verify Supabase environment variables
3. Check network tab để xem API calls

### Images không load

1. Ensure Supabase Storage bucket "photos" đã được tạo
2. Check Storage policies trong Supabase Dashboard

### Routing không hoạt động

- App đã sử dụng HashRouter (#) thay vì BrowserRouter để tương thích với Cloudflare Pages

## 📊 Monitoring

1. Vào Cloudflare Dashboard → Pages → Select project
2. Xem analytics, deployments, logs
3. Monitor performance và errors

## 🔐 Security

- Supabase keys là anon key (public safe)
- User authentication được handle bởi Supabase
- Server-side operations được protected bởi Row Level Security (RLS)

## 💡 Tips

1. **Preview Deployments**: Mỗi PR sẽ có preview URL riêng để test trước khi merge
2. **Instant Rollbacks**: Có thể rollback về bất kỳ version nào trong 1 click
3. **Custom Domain**: Chỉ cần thêm domain, Cloudflare tự setup SSL free
4. **Analytics**: Cloudflare Pages có built-in analytics

## 📞 Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Vite Docs: https://vitejs.dev/
- Supabase Docs: https://supabase.com/docs

---

**🎉 Chúc mừng! Ứng dụng của bạn đã được deploy thành công!**

