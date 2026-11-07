# CẨM NANG VẬN HÀNH & TRIỂN KHAI DADA MILKTEA (`dada-milktea`)

**Dự án**: Game Quản Lý Tiệm Trà Sữa DADA (Dada Milktea)  
**Kiến trúc**: HTML5 / PWA Mobile-First / Vanilla ES Modules / Web Audio API / Cache-First Service Worker  
**Tối ưu thiết bị**: 100% thân thiện với Điện thoại (iPhone, Android) và Máy tính bảng (iPad)  

---

## 🚀 1. Chơi Ngay Cục Bộ / Mạng LAN (1-Click)

Bạn có thể mở chơi game ngay lập tức mà không cần bất kỳ công đoạn cài đặt phức tạp nào:

### Cách nhanh nhất trên Windows:
- Nhấp đúp chuột vào tệp: **`start_game.bat`**.
- Trình duyệt sẽ tự động mở trang game tại: `http://localhost:8080/`.

### Chơi trên Điện thoại / Máy tính bảng cùng mạng WiFi:
1. Mở Command Prompt hoặc PowerShell trên máy tính, gõ `ipconfig` để lấy địa chỉ IPv4 (Ví dụ: `192.168.1.15`).
2. Khởi chạy máy chủ cục bộ trên máy tính (`python -m http.server 8080` hoặc chạy `start_game.bat`).
3. Mở trình duyệt Safari (trên iPhone/iPad) hoặc Chrome (trên Android) và truy cập:
   ```
   http://192.168.1.15:8080/
   ```
4. Bạn sẽ thấy giao diện Tiệm Trà Sữa DADA hiển thị tràn viền, âm thanh sống động và cảm ứng siêu nhạy!

---

## 🌐 2. Đưa Lên Internet Miễn Phí Với Đường Dẫn `dada-milktea`

### Cách A: Triển khai qua GitHub Pages (Miễn phí 100%, đường dẫn: `https://<username>.github.io/dada-milktea`)
1. Tạo một repository mới trên GitHub với tên: **`dada-milktea`**.
2. Đẩy toàn bộ mã nguồn trong thư mục này lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: release Dada Milktea web game v1.0"
   git branch -M main
   git remote add origin https://github.com/<tên-tài-khoản-của-bạn>/dada-milktea.git
   git push -u origin main
   ```
3. Truy cập GitHub Repo -> **Settings** -> **Pages** -> Tại mục **Build and deployment**, chọn **GitHub Actions**.
4. GitHub Actions sẽ tự động kích hoạt tệp `.github/workflows/deploy.yml` đã được tạo sẵn và xuất bản trang web lên:
   👉 `https://<tên-tài-khoản-của-bạn>.github.io/dada-milktea/`

---

### Cách B: Triển khai qua Vercel (1-Click, đường dẫn: `https://dada-milktea.vercel.app`)
1. Đăng nhập [Vercel.com](https://vercel.com).
2. Nhấn **Add New Project** -> Chọn repository `dada-milktea` (hoặc kéo thả cả thư mục này vào giao diện Vercel).
3. Đặt tên project là `dada-milktea`.
4. Nhấn **Deploy**. Tệp `vercel.json` đã cấu hình sẵn toàn bộ bộ nhớ đệm và rewrite cho link `dada-milktea`.

---

### Cách C: Triển khai qua Docker / Máy chủ riêng
Nếu bạn có VPS hoặc máy chủ riêng:
```bash
docker compose up -d
```
Ứng dụng sẽ chạy ngầm qua Nginx Alpine siêu nhẹ (chỉ ~15MB RAM) tại cổng `8080` với đường dẫn `http://your-server-ip:8080/dada-milktea/`.

---

## 📱 3. Hướng Dẫn Cài Đặt Lên Màn Hình Chính (PWA App Standalone)

Trò chơi đã được cấu hình chuẩn Progressive Web App (PWA) với logo nhận diện Dada Milktea độc quyền:

### Trên iPhone & iPad (Safari):
1. Truy cập link trang web trên trình duyệt **Safari**.
2. Nhấn vào biểu tượng **Chia sẻ** (hình ô vuông có mũi tên hướng lên ở thanh công cụ).
3. Cuộn xuống và chọn **"Thêm vào MH chính"** (Add to Home Screen).
4. Nhấn **Thêm** (Add).
5. Biểu tượng **Dada Trà Sữa** với logo Chibi mạ vàng sẽ xuất hiện trên màn hình chính. Khi mở lên, game sẽ chạy toàn màn hình (Standalone) không thanh địa chỉ như một ứng dụng iOS gốc!

### Trên Android (Chrome / Samsung Internet):
1. Truy cập link trang web trên trình duyệt **Chrome**.
2. Nhấn vào biểu tượng dấu 3 chấm góc trên bên phải (hoặc banner thông báo ở đáy màn hình).
3. Chọn **"Cài đặt ứng dụng"** (Install App) hoặc **"Thêm vào màn hình chính"**.
4. Game sẽ được cài đặt và lưu cache ngoại tuyến 100%, có thể mở chơi ngay cả khi máy bật Chế độ máy bay (Airplane mode).

---

## ✨ 4. Điểm Nhấn Kỹ Thuật Độc Quyền Của Dự Án

1. **Độc lập 100%**: Đã gỡ bỏ toàn bộ SDK JoyUp và mã theo dõi bên ngoài; tiến trình game lưu trữ an toàn trong `localStorage` người dùng.
2. **Khung nhìn 9:16 Adaptive**: Căn giữa sang trọng trên iPad/Tablet với viền ambient mờ; hiển thị tràn viền mượt mà trên iPhone/Android.
3. **Safe Area Notch & Dynamic Island**: Header và footer tự động thụt lùi an toàn, không bị che khuất bởi cụm camera hay thanh gạt Home.
4. **Triệt tiêu độ trễ cảm ứng**: Thuộc tính `touch-action: manipulation` giúp thao tác rót trà, xúc trân châu, lắc bình phản hồi tức thì (0ms delay).
5. **Khóa xoay thông minh**: Tự động nhắc nhở xoay dọc màn hình khi người dùng cầm ngang điện thoại.
6. **Mở khóa âm thanh di động mượt mà**: Tuân thủ Web Audio Autoplay Policy của Apple Safari và Google Chrome.
