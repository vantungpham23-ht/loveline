# Loveline - Ứng dụng dành cho các cặp đôi

Loveline là một web-app mobile-first được thiết kế dành riêng cho các cặp đôi để cùng nhau tạo và lưu giữ những kỷ niệm đẹp.

## ✨ Tính năng chính

- 🔐 **Xác thực người dùng**: Đăng ký và đăng nhập an toàn
- 💕 **Ghép đôi**: Tạo mã mời để ghép đôi với người thương
- 📸 **Quản lý album**: Tạo và quản lý album ảnh chung
- 📍 **Bản đồ vị trí**: Chia sẻ vị trí hiện tại
- ⏰ **Đếm ngược tình yêu**: Theo dõi số ngày yêu nhau
- 📱 **Mobile-first**: Thiết kế tối ưu cho điện thoại

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Backend**: Supabase
- **Maps**: React Leaflet
- **Storage**: Supabase Storage

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình môi trường
Tạo file `.env.local` với nội dung:
```
VITE_SUPABASE_URL=https://hszmtodzutnzpqpjhuxg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzem10b2R6dXRuenBxcGpodXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQ2MjUsImV4cCI6MjA3Njk1MDYyNX0.8taC5uxUh1b122KDjWMQtyPWi3-ujBpKBmB9SZas2m4
```

### Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── ui/                 # UI components cơ bản
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   ├── layout/             # Layout components
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── LoveCounter.jsx     # Component đếm ngày yêu
│   ├── AlbumTimelineItem.jsx
│   ├── LocationMap.jsx
│   └── ProtectedRoute.jsx
├── pages/                   # Các trang chính
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── PairingPage.jsx
│   ├── AlbumsPage.jsx
│   ├── AlbumDetailPage.jsx
│   └── SettingsPage.jsx
├── store/
│   └── appStore.js          # Zustand store
├── lib/
│   └── supabaseClient.js    # Supabase client
├── App.jsx                  # App component với routing
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## 🗄️ Database Schema

Ứng dụng sử dụng Supabase với các bảng sau:

- `profiles`: Thông tin người dùng
- `couples`: Thông tin cặp đôi
- `invites`: Mã mời ghép đôi
- `albums`: Album ảnh
- `photos`: Ảnh trong album

## 🎨 Thiết kế

- **Mobile-first**: Ưu tiên trải nghiệm trên điện thoại
- **Clean & Modern**: Thiết kế sạch sẽ, hiện đại
- **Responsive**: Tương thích với mọi kích thước màn hình
- **Color Scheme**: Primary (Red) và Secondary (Purple)

## 📱 Cách sử dụng

1. **Đăng ký/Đăng nhập**: Tạo tài khoản hoặc đăng nhập
2. **Ghép đôi**: Tạo mã mời hoặc nhập mã để ghép đôi
3. **Tạo album**: Tạo album để lưu trữ ảnh chung
4. **Thêm ảnh**: Upload ảnh vào album
5. **Chia sẻ vị trí**: Xem vị trí hiện tại trên bản đồ
6. **Theo dõi**: Xem số ngày yêu nhau

## 🔧 Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build ứng dụng cho production
- `npm run preview`: Preview build production

## 🚀 Deploy lên Cloudflare Pages

### Cách nhanh:
1. Push code lên GitHub
2. Vào [Cloudflare Pages](https://dash.cloudflare.com)
3. Connect GitHub repository
4. Build settings: Framework `Vite`, Build command `npm run build`, Output `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

📖 Xem hướng dẫn chi tiết trong file [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

Được phát triển với ❤️ cho các cặp đôi
