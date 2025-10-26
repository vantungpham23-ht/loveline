# 🚀 Hướng dẫn Push code và Deploy

## Bước 1: Push code lên GitHub

### Tạo repository trên GitHub

1. Truy cập [github.com](https://github.com)
2. Click vào biểu tượng **+** ở góc trên bên phải
3. Chọn **New repository**
4. Nhập thông tin:
   - **Repository name**: `loveline` (hoặc tên bạn muốn)
   - **Description**: Loveline - Ứng dụng dành cho các cặp đôi
   - **Visibility**: Public (hoặc Private nếu bạn muốn)
5. Click **Create repository**

### Push code lên GitHub

**Cách 1: Nếu bạn chưa có remote repository**

```bash
# Add remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/loveline.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

**Cách 2: Nếu bạn đã tạo repository trên GitHub**

GitHub sẽ hiển thị commands, copy và chạy:

```bash
git remote add origin https://github.com/YOUR_USERNAME/loveline.git
git branch -M main
git push -u origin main
```

**Lưu ý**: Thay `YOUR_USERNAME` bằng username GitHub thực của bạn!

---

## Bước 2: Deploy lên Cloudflare Pages

### 1. Đăng nhập Cloudflare

1. Truy cập [dash.cloudflare.com](https://dash.cloudflare.com)
2. Đăng nhập bằng tài khoản của bạn (hoặc đăng ký mới)

### 2. Tạo Pages Project

1. Click vào **Pages** ở sidebar bên trái
2. Click nút **Create a project**
3. Chọn **Connect to Git**
4. Cho phép Cloudflare truy cập GitHub của bạn
5. Chọn repository **loveline**

### 3. Cấu hình Build Settings

**Project name**: `loveline`

**Framework preset**: Vite (Cloudflare sẽ tự động detect)

**Build settings** (click nút "Show build settings"):
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 4. Thêm Environment Variables (QUAN TRỌNG!)

Scroll xuống phần **Environment variables** và add:

**Production environment**:

1. Click **Add variable**
2. Name: `VITE_SUPABASE_URL`
3. Value: `https://hszmtodzutnzpqpjhuxg.supabase.co`
4. Click **Save**

Lặp lại để add biến thứ 2:

1. Click **Add variable**
2. Name: `VITE_SUPABASE_ANON_KEY`
3. Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzem10b2R6dXRuenBxcGpodXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQ2MjUsImV4cCI6MjA3Njk1MDYyNX0.8taC5uxUh1b122KDjWMQtyPWi3-ujBpKBmB9SZas2m4`
4. Click **Save**

**Preview environment** (optional - copy các variables sang):

1. Click vào tab **Preview**
2. Copy same 2 variables từ Production sang Preview

### 5. Deploy!

1. Click nút **Save and Deploy**
2. Chờ 2-5 phút để build hoàn tất
3. Build status sẽ hiển thị "Success" khi xong

### 6. Lấy URL của ứng dụng

Sau khi deploy thành công:
- Production URL: `https://loveline.pages.dev` (hoặc tên bạn chọn)
- URL này sẽ được hiển thị trong dashboard

---

## Bước 3: Tùy chọn - Custom Domain

1. Vào **Pages** → Chọn project **loveline**
2. Tab **Custom domains** → Click **Set up a custom domain**
3. Nhập domain của bạn: `loveline.yourdomain.com`
4. Cloudflare sẽ tự động setup DNS và SSL
5. Đợi SSL certificate active (thường vài phút)

---

## ✅ Checklist sau khi deploy

- [ ] Code đã được push lên GitHub
- [ ] Cloudflare Pages project đã được tạo
- [ ] Environment variables đã được add
- [ ] Build thành công
- [ ] Truy cập URL và test ứng dụng
- [ ] Đăng nhập thành công
- [ ] Test các tính năng chính

---

## 🔄 Workflow hàng ngày

Mỗi khi bạn thay đổi code:

```bash
# 1. Commit changes
git add .
git commit -m "Description of changes"

# 2. Push to GitHub
git push origin main

# 3. Cloudflare tự động deploy (2-5 phút)
# Kiểm tra status trong Cloudflare Dashboard
```

---

## 🐛 Xử lý lỗi thường gặp

### Build fail

**Nguyên nhân**: 
- Environment variables chưa được add
- Code có lỗi syntax

**Giải pháp**:
1. Check build logs trong Cloudflare Dashboard
2. Ensure tất cả env variables đã được add
3. Test build local: `npm run build`

### App không hoạt động sau khi deploy

**Nguyên nhân**: 
- Supabase keys sai hoặc chưa có
- Router có vấn đề

**Giải pháp**:
1. Check browser console (F12) để xem lỗi
2. Verify env variables trong Cloudflare settings
3. Check Supabase dashboard xem database đã setup chưa

### Images không load

**Nguyên nhân**:
- Storage bucket chưa được tạo
- Storage policies chưa được setup

**Giải pháp**:
1. Vào Supabase Dashboard → Storage
2. Tạo bucket tên "photos" nếu chưa có
3. Setup policies để users có thể upload

---

## 📊 Monitor Deployments

1. Vào Cloudflare Dashboard → Pages → loveline
2. Tab **Deployments** để xem tất cả các lần deploy
3. Click vào deployment bất kỳ để xem logs chi tiết
4. Có thể rollback về version trước bất kỳ lúc nào

---

## 🎉 Hoàn tất!

Sau khi deploy thành công:
- ✅ Ứng dụng có thể truy cập qua Internet
- ✅ Tự động update mỗi khi push code
- ✅ Miễn phí với Cloudflare Pages free tier
- ✅ SSL tự động
- ✅ Global CDN

**Chúc mừng bạn đã deploy thành công! 🎊**

