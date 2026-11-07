# CHỈ THỊ CÔNG VIỆC SỐ 01 (ĐIỀU CHỈNH) - DỰ ÁN DADA MILKTEA
**Số hiệu chỉ thị**: DISPATCH-01  
**Ngày ban hành**: 2026-11-07  
**Người phát lệnh**: @team-lead  
**Người nhận nhiệm vụ**: @scraper-deobf  
**Mục tiêu**: Di chuyển tài nguyên web tĩnh, tái cấu trúc mã nguồn JavaScript và thiết lập lưu trữ ngoại tuyến độc lập  

---

## 1. VAI TRÒ (Role)
- **Chức danh**: Chuyên viên Di chuyển Tài nguyên & Tái cấu trúc Mã nguồn Frontend (Frontend Asset Migration & Code Refactoring Specialist).
- **Codename trong đội**: `@scraper-deobf`.
- **Kỹ năng Global bắt buộc công bố & áp dụng**:
  1. `web-scraping`: Kỹ năng tải, trích xuất và đồng bộ hóa tài nguyên web tĩnh đệ quy (HTML, CSS, JS modules, sprite textures, web audio).
  2. `js-deobfuscator`: Kỹ năng định dạng, tái cấu trúc và làm sạch mã nguồn JavaScript nén/rối (AST refactoring, string resolving, identifier normalization).
  3. `reverse-engineer`: Kỹ năng phân tích luồng logic ứng dụng web.
  4. `modern-javascript-patterns`: Kỹ năng chuẩn hóa mã nguồn theo mô hình ES Modules hiện đại.

---

## 2. ĐỌC TÀI LIỆU GÌ (Documentation to Read)
Trước khi tiến hành công việc, bạn **bắt buộc phải đọc kỹ các tài liệu sau**:
1. **Quy chuẩn điều hành**: `C:\DATA\03_Resources\tra-sua\AGENTS.md` (Đặc biệt phần *Mandatory Execution Protocol* và *Team Roster*).
2. **Hướng dẫn quy trình kỹ năng**:
   - `C:\Users\Admin\.agents\skills\web-scraping\SKILL.md` (Phương pháp phân tích DOM, trích xuất URL từ stylesheet và module dependencies).
   - `C:\Users\Admin\.agents\skills\js-deobfuscator\SKILL.md` (Quy trình 3 bước chuẩn hóa mã nguồn: string inlining, AST simplification, biến đổi định danh rõ nghĩa).
3. **Kế hoạch dự án**:
   - `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (Nhiệm vụ `TSK-01` và `TSK-02`).
   - `C:\DATA\03_Resources\tra-sua\.messages\README.md` (Quy ước giao tiếp nội bộ).

---

## 3. LÀM GÌ (Actionable Tasks & Scope of Work)

Thực hiện trọn gói 2 nhiệm vụ kỹ thuật nền tảng:

### Nhiệm vụ 1: Di chuyển & Đồng bộ 100% tài nguyên tĩnh về môi trường cục bộ (Task `TSK-01`)
- **Nguồn tài nguyên**: `https://api.joyup.vn/games/tiem-tra-sua-joyup/index.html`.
- **Thực hiện tải và cấu trúc thư mục cục bộ tại dự án**:
  - Tệp gốc: `index.html` và `manifest.webmanifest`.
  - Stylesheet & Đồ họa: `css/style.css`, `css/img.css`, cùng toàn bộ hình ảnh texture/sprite sheet được khai báo trong CSS.
  - Cây thư mục module logic JavaScript:
    - Module gốc: `js/main.js`, `js/errors.js`, `js/audio.js`, `js/state.js`, `js/cloud.js`, `js/native.js`, `js/orient.js`.
    - Module giao diện: Toàn bộ thư mục `js/ui/` (`shell.js`, `auth.js`, `splash.js`, `prep.js`, `sell.js`, `report.js`, `tour.js`, `journey.js`).
  - Toàn bộ tệp âm thanh hiệu ứng Web Audio (`.mp3`, `.ogg`) và biểu tượng ứng dụng (`icons/`).
- **Chuẩn hóa liên kết**: Chuyển đổi toàn bộ liên kết tuyệt đối/mạng bên ngoài thành liên kết nội bộ tương đối (`./css/`, `./js/`, `./assets/`, `./icons/`).

### Nhiệm vụ 2: Tái cấu trúc mã nguồn JS & Thiết lập lưu trữ độc lập (Task `TSK-02`)
- **Tái cấu trúc và làm sạch tệp `main.js`**:
  - Giải mã mảng chuỗi nội bộ và hàm ánh xạ, chuyển đổi các chỉ mục tra cứu thành giá trị chuỗi văn bản rõ nghĩa (`'auth'`, `'splash'`, `'prep'`, `'sell'`, `'report'`, `'journey'`).
  - Đổi tên các biến import từ dạng mã nén sang định danh tường minh (ví dụ: `sellUI`, `prepUI`, `reportUI`).
  - Định dạng lại mã nguồn (Code formatting/beautification) để mã nguồn dễ bảo trì và mở rộng.
- **Tách biệt module bên ngoài & Chuyển đổi lưu trữ sang LocalStorage**:
  - Gỡ bỏ các thẻ nạp script theo dõi/analytics của bên thứ ba khỏi `index.html`.
  - Cập nhật lại `cloud.js` và `state.js` để dữ liệu người chơi được lưu trữ và tải trực tiếp từ `window.localStorage` của trình duyệt. Đảm bảo ứng dụng chạy độc lập 100% ngoại tuyến (offline-ready) không cần kết nối máy chủ ngoài.
- **Kiểm thử tính toàn vẹn cục bộ**:
  - Khởi chạy static HTTP server nội bộ (Localhost) để kiểm tra toàn bộ ứng dụng nạp mượt mà, xác nhận không còn tài nguyên nào bị lỗi kết nối (HTTP 404).

---

## 4. BÁO CÁO TEAM LEAD CÁI GÌ (Deliverables & Reporting Protocol)

Sau khi hoàn tất, bạn **bắt buộc** phải:
1. **Cập nhật tiến độ**: Đánh dấu hoàn thành (`DONE`) cho `TSK-01` và `TSK-02` trong file `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md`.
2. **Lập biên bản báo cáo** ghi vào file `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` gồm các mục:
   - **Kỹ năng Global đã áp dụng**: Nêu rõ `web-scraping` và `js-deobfuscator`.
   - **Bảng thống kê tài nguyên**: Tổng số tệp đã di chuyển thành công (HTML, CSS, JS, Ảnh/Sprites, Âm thanh), dung lượng và xác nhận mã HTTP 200.
   - **Minh chứng tái cấu trúc mã nguồn**: Trích đoạn so sánh tệp `main.js` trước và sau khi làm sạch để chứng minh mã nguồn đã trong sáng, rõ nghĩa.
   - **Xác nhận cơ chế lưu trữ**: Báo cáo việc chuyển đổi sang `localStorage` đã hoạt động ổn định.
   - **Kết quả kiểm thử Local**: Báo cáo chạy máy chủ nội bộ không có lỗi kết nối.
   - **Bàn giao (Handoff)**: Xác nhận bàn giao mã nguồn sạch cho `@game-dev` và `@brand-designer` để bước vào giai đoạn thiết kế nhận diện Dada Milktea và tối ưu giao diện di động.


---

# CHỈ THỊ CÔNG VIỆC SỐ 02 - DỰ ÁN DADA MILKTEA
**Số hiệu chỉ thị**: DISPATCH-02  
**Ngày ban hành**: 2026-11-07  
**Người phát lệnh**: @team-lead  
**Người nhận nhiệm vụ**: @game-dev  
**Mục tiêu**: Tối ưu hóa trải nghiệm Mobile & Tablet (9:16 Adaptive, Safe Area, Touch, Orientation), chuyển đổi nhận diện Dada Milktea và đóng gói PWA  

---

## 1. VAI TRÒ (Role)
- **Chức danh**: Kỹ sư Phát triển Game Web & Di động (Mobile Web Game Engineer).
- **Codename trong đội**: `@game-dev`.
- **Kỹ năng Global BẮT BUỘC công bố & áp dụng**:
  1. `html5-game-dev`: Tái cấu trúc engine game 2D HTML5, modular ES game loop, xử lý lưu trữ LocalStorage.
  2. `pwa-mobile-mastery`: Tối ưu hóa chuyên sâu cho điện thoại và máy tính bảng (khung 9:16 adaptive, safe-area tai thỏ, triệt tiêu độ trễ cảm ứng, audio unlock policy).
  3. `frontend-developer`: Tái cấu trúc layout CSS responsive, căn chỉnh giao diện không vỡ tỉ lệ.
  4. `javascript-pro`: Xử lý logic sự kiện chạm, audio context và chu trình vòng đời PWA.

---

## 2. ĐỌC TÀI LIỆU GÌ (Documentation to Read)
Trước khi bắt đầu, bạn **bắt buộc phải đọc kỹ các tài liệu sau**:
1. **Quy chuẩn điều hành**: `C:\DATA\03_Resources\tra-sua\AGENTS.md` (Mục *Mandatory Execution Protocol* và *Team Roster*).
2. **Hướng dẫn nghiệp vụ kỹ năng**:
   - `C:\Users\Admin\.agents\skills\pwa-mobile-mastery\SKILL.md` (Quy chuẩn safe-area-insets, touch-action, orientation guard, service worker).
   - `C:\Users\Admin\.agents\skills\html5-game-dev\SKILL.md` (Quy chuẩn game loop, modular shell, LocalStorage persistence).
   - `C:\Users\Admin\.agents\skills\frontend-developer\SKILL.md` (Responsive layout, component viewports).
3. **Báo cáo hoàn thành của @scraper-deobf**:
   - Đọc phiên bàn giao trong `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` (Xác nhận 100% tài nguyên đã ở dạng cục bộ và `main.js` đã sạch).
4. **Kế hoạch dự án**:
   - `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (Nhiệm vụ `TSK-04` và `TSK-05`).

---

## 3. LÀM GÌ (Actionable Tasks & Detailed Scope)

Bạn phụ trách thực hiện trọn gói 2 nhiệm vụ cốt lõi sau:

### Nhiệm vụ 1: Tối ưu hóa trải nghiệm chuyên sâu cho Mobile & Tablet (Task `TSK-05` - Ưu tiên P0)
- **Thiết kế khung nhìn 9:16 Adaptive cho Máy tính bảng & Màn hình lớn**:
  - Không kéo dãn giao diện làm vỡ tỉ lệ game trên iPad hay tablet Android.
  - Trên màn hình lớn/máy tính bảng: Căn giữa khung game dọc theo tỉ lệ chuẩn (tối đa ~480px hoặc tỷ lệ 9:16), hai bên tạo viền nền mờ thẩm mỹ (ambient blurred background).
  - Trên điện thoại thông minh: Hiển thị tràn viền hoàn hảo, tự động co giãn theo chiều cao màn hình (`100dvh`), triệt tiêu thanh cuộn thừa ngoài ý muốn.
- **Xử lý Safe Area cho iPhone / Android có Notch & Dynamic Island**:
  - Cấu hình CSS `env(safe-area-inset-top)` và `env(safe-area-inset-bottom)` cho header `#top` và footer `#bottom` để không bị che khuất bởi thanh điều hướng hay cụm camera.
- **Triệt tiêu độ trễ cảm ứng & Ngăn chặn cử chỉ lỗi (Zero Touch Delay)**:
  - Bổ sung `touch-action: manipulation;` trên toàn bộ nút bấm và vùng tương tác pha chế.
  - Vô hiệu hóa tính năng zoom đúp ngoài ý muốn và hiệu ứng kéo nảy trang (pull-to-refresh overscroll) trên iOS Safari / Android Chrome (`overscroll-behavior-y: none`).
- **Khóa & Cảnh báo góc xoay màn hình (Orientation Guarding)**:
  - Cập nhật module `js/orient.js`: Khi người dùng cầm ngang điện thoại, hiển thị màn hình nhắc nhở tinh tế "Vui lòng xoay dọc màn hình để trải nghiệm Tiệm Trà Sữa DADA tốt nhất".
- **Web Audio Mobile Unlock**:
  - Đảm bảo cơ chế mở khóa Web Audio context trên Safari iOS diễn ra êm mượt ngay cử chỉ chạm đầu tiên (`pointerdown`), không gây khựng tiếng hay nghẽn âm thanh.

### Nhiệm vụ 2: Tái cấu trúc nhận diện Dada Milktea & Cấu hình PWA (Task `TSK-04`)
- **Chuyển đổi thông tin thương hiệu thành Dada Milktea**:
  - Cập nhật `index.html`: Đổi tiêu đề thành `"Dada Milktea - Tiệm Trà Sữa DADA"`, cập nhật `apple-mobile-web-app-title` thành `"Dada Trà Sữa"`, cập nhật thẻ meta description, canonical và OpenGraph.
  - Cập nhật `manifest.webmanifest`: name `"Dada Milktea"`, short_name `"Dada Trà Sữa"`, theme_color sang màu trà sữa ấm `#3E2A22`, start_url `"./"`.
  - Cập nhật văn bản chào mừng và thông báo trong các module `js/ui/auth.js`, `js/ui/splash.js`, `js/ui/journey.js`, `js/ui/report.js` để thể hiện đúng tinh thần "Tiệm Trà Sữa DADA".
- **Cấu hình Service Worker ngoại tuyến (PWA Offline Cache)**:
  - Tạo tệp `sw.js` đăng ký bộ nhớ đệm Cache-First cho toàn bộ HTML, CSS, JS, Audio và Hình ảnh để game có thể chơi mượt mà khi mất mạng hoặc khi người dùng cài đặt "Thêm vào màn hình chính" (Add to Home Screen).
  - Đăng ký `sw.js` trong `index.html`.

---

## 4. BÁO CÁO TEAM LEAD CÁI GÌ (Deliverables & Reporting Protocol)

Sau khi hoàn tất, bạn **bắt buộc** phải:
1. **Cập nhật tiến độ**: Đánh dấu hoàn thành (`DONE`) cho `TSK-04` và `TSK-05` trong file `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md`.
2. **Ghi báo cáo nghiệm thu** vào file `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` gồm các mục:
   - **Kỹ năng Global đã áp dụng**: Nêu rõ `Applying Skill: html5-game-dev`, `pwa-mobile-mastery`, `frontend-developer`.
   - **Minh chứng tối ưu Mobile & Tablet**: Liệt kê các giải pháp CSS (Safe Area, 9:16 adaptive container, touch-action, orientation overlay).
   - **Minh chứng chuyển đổi Dada Milktea**: Danh sách các tệp đã cập nhật thương hiệu (`index.html`, `manifest.webmanifest`, các UI modules).
   - **Minh chứng PWA & Offline Cache**: Tệp `sw.js` và xác nhận cài đặt PWA ngoại tuyến.
   - **Kết quả kiểm thử**: Kết quả test hiển thị trên kích thước màn hình Mobile (iPhone 14/15, Android) và Tablet (iPad).
   - **Bàn giao (Handoff)**: Xác nhận chuyển giao toàn bộ sản phẩm hoàn thiện cho `@qa-tester` để tiến hành bước nghiệm thu kiểm thử chéo đa thiết bị (TSK-06).


---

# CHỈ THỊ CÔNG VIỆC SỐ 03 - DỰ ÁN DADA MILKTEA
**Số hiệu chỉ thị**: DISPATCH-03  
**Ngày ban hành**: 2026-11-07  
**Người phát lệnh**: @team-lead  
**Người nhận nhiệm vụ**: @qa-tester  
**Mục tiêu**: Kiểm thử chéo toàn diện đa thiết bị di động (Mobile, Tablet, Safe Area, Touch Latency, Orientation, Web Audio, PWA Offline)  

---

## 1. VAI TRÒ (Role)
- **Chức danh**: Chuyên viên Kiểm thử Đa thiết bị & Đảm bảo Chất lượng Di động (QA & Cross-Device Validator).
- **Codename trong đội**: `@qa-tester`.
- **Kỹ năng Global BẮT BUỘC công bố & áp dụng**:
  1. `mobile-developer`: Kỹ năng kiểm thử responsive, profiling độ phân giải, kiểm tra safe area và thao tác chạm đa màn hình.
  2. `ui-visual-validator`: Kỹ năng thẩm định giao diện thị giác, kiểm tra căn chỉnh, vỡ khung hình, độ tương phản màu sắc.
  3. `screen-reader-testing`: Kỹ năng kiểm thử khả năng tiếp cận (accessibility), ngữ nghĩa HTML và thông báo ARIA trên di động.

---

## 2. ĐỌC TÀI LIỆU GÌ (Documentation to Read)
Trước khi bắt đầu, bạn **bắt buộc phải đọc kỹ các tài liệu sau**:
1. **Quy chuẩn điều hành**: `C:\DATA\03_Resources\tra-sua\AGENTS.md` (Mục *Mandatory Execution Protocol* và *Team Roster*).
2. **Hướng dẫn nghiệp vụ kỹ năng**:
   - `C:\Users\Admin\.agents\skills\mobile-developer\SKILL.md` (Mobile profiling, viewport audit, touch events).
   - `C:\Users\Admin\.agents\skills\ui-visual-validator\SKILL.md` (Visual alignment, layout integrity).
   - `C:\Users\Admin\.agents\skills\screen-reader-testing\SKILL.md` (Accessibility check).
3. **Báo cáo hoàn thành của @game-dev**:
   - Đọc phiên bàn giao trong `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` (Đã có khung 9:16 adaptive, safe area, touch-action, orientation guard, sw.js).
4. **Kế hoạch dự án**:
   - `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (Nhiệm vụ `TSK-06`).

---

## 3. LÀM GÌ (Actionable Tasks & Detailed Scope)

Bạn phụ trách thực hiện trọn gói các hạng mục kiểm thử nghiệm thu sau:

### Hạng mục 1: Kiểm thử Ma trận Kích thước Màn hình (Device Viewport Matrix)
- **Điện thoại nhỏ (Small Viewports: 360x640, 375x667 - iPhone SE)**:
  - Kiểm tra xem giao diện pha chế, quầy hàng, bảng nguyên liệu có bị tràn viền (overflow) hay che khuất nút bấm không.
- **Điện thoại màn hình dài có Tai thỏ / Dynamic Island (393x852 - iPhone 14/15/16 Pro, 412x915 - Galaxy S23/S24)**:
  - Kiểm tra vùng an toàn (Safe Area): Thanh tiêu đề `#top` và thanh chân trang `#bottom` có được bù đệm CSS an toàn, không bị camera tai thỏ hoặc thanh gạt Home iOS đè lên.
- **Máy tính bảng (Tablets: 768x1024 - iPad Mini, 820x1180 - iPad 10th)**:
  - Kiểm tra khung game 9:16 có tự động căn giữa cân đối (max-width: 480px) không bị kéo giãn bè ngang; kiểm tra hiệu ứng nền mờ sang trọng hai bên sườn.

### Hạng mục 2: Kiểm thử Phản hồi Cảm ứng & Cử chỉ (Touch & Gesture Audit)
- Kiểm tra độ nhạy cảm ứng trên toàn bộ các nút tương tác (chọn ly, rót trà, múc trân châu, lắc bình, dán nắp, phục vụ khách hàng) -> Xác nhận phản hồi tức thì, không có độ trễ 300ms click.
- Thao tác vuốt/chạm nhanh liên tục -> Xác nhận cử chỉ phóng to đúp ngoài ý muốn và hiệu ứng kéo nảy trang (pull-to-refresh overscroll) đã bị triệt tiêu hoàn toàn.

### Hạng mục 3: Kiểm thử Khóa xoay (Orientation Guard) & Web Audio
- Giả lập xoay ngang màn hình điện thoại -> Xác minh lớp phủ `#orient-guard` hiển thị mượt mà kèm thông điệp: "Vui lòng xoay dọc màn hình để trải nghiệm Tiệm Trà Sữa DADA tốt nhất".
- Kiểm thử cơ chế mở khóa Web Audio: Chạm màn hình lần đầu để kích hoạt âm thanh, kiểm tra nhạc nền BGM và các hiệu ứng SFX pha chế, kiểm tra tự động tạm dừng khi chuyển tab (`visibilitychange`).

### Hạng mục 4: Kiểm thử PWA Ngoại tuyến & Lưu trữ (Offline & Storage Audit)
- Kiểm tra Service Worker `sw.js`: Đăng ký thành công và cache đầy đủ các tệp tài nguyên tĩnh.
- Giả lập ngắt kết nối mạng (Offline Mode): Kiểm tra game vẫn mở lên và chơi mượt mà từ bộ nhớ đệm.
- Kiểm tra tiến trình game: Dữ liệu tiền vàng, cấp độ quán, công thức đã pha được lưu trữ và tải lại chính xác từ `window.localStorage`.

---

## 4. BÁO CÁO TEAM LEAD CÁI GÌ (Deliverables & Reporting Protocol)

Sau khi hoàn tất, bạn **bắt buộc** phải:
1. **Cập nhật tiến độ**: Đánh dấu hoàn thành (`DONE`) cho `TSK-06` trong file `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md`.
2. **Ghi biên bản nghiệm thu** vào file `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` gồm các mục:
   - **Kỹ năng Global đã áp dụng**: Nêu rõ `Applying Skill: mobile-developer`, `Applying Skill: ui-visual-validator`, `Applying Skill: screen-reader-testing`.
   - **Bảng ma trận kiểm thử thiết bị (Device Matrix Table)**: Ghi rõ kết quả từng dòng máy (iPhone SE, iPhone 14/15, Galaxy, iPad).
   - **Đánh giá trải nghiệm cảm ứng & âm thanh**: Độ nhạy touch, zero delay, audio policy mobile.
   - **Đánh giá PWA Offline**: Tình trạng cache và khả năng vận hành ngoại tuyến 100%.
   - **Kết luận nghiệm thu (Verdict)**: Xác nhận `PASS 100%` và bàn giao cho `@team-lead` để thực hiện đóng gói phát hành cuối cùng (TSK-07).


---

# CHỈ THỊ CÔNG VIỆC SỐ 04 - DỰ ÁN DADA MILKTEA
**Số hiệu chỉ thị**: DISPATCH-04  
**Ngày ban hành**: 2026-11-07  
**Người phát lệnh**: @team-lead  
**Người nhận nhiệm vụ**: @brand-designer  
**Mục tiêu**: Hoàn thiện bộ nhận diện thị giác độc quyền cho Dada Milktea (Logo SVG, bộ App Icons PWA 192/512/Apple-touch, bảng màu Brand Tokens, bảng hiệu tiệm DADA và menu đặc sắc)  

---

## 1. VAI TRÒ (Role)
- **Chức danh**: Chuyên viên Thiết kế Nhận diện & Đồ họa Thương hiệu (Brand & Visual Asset Designer).
- **Codename trong đội**: `@brand-designer`.
- **Kỹ năng Global BẮT BUỘC công bố & áp dụng**:
  1. `brand`: Xây dựng ngôn ngữ nhận diện, thông điệp thương hiệu, tiếng nói thương hiệu cho Dada Milktea.
  2. `brandkit`: Thiết kế hệ thống asset thương hiệu, logo, bộ icon ứng dụng PWA và avatar.
  3. `ui-styling`: Chuẩn hóa bảng màu CSS Design Tokens, gradient trà sữa và typography.
  4. `taste-skill`: Tinh chỉnh thẩm mỹ cao cấp, bố cục hài hòa, chống lỗi thiết kế vụng về.

---

## 2. ĐỌC TÀI LIỆU GÌ (Documentation to Read)
Trước khi bắt đầu, bạn **bắt buộc phải đọc kỹ các tài liệu sau**:
1. **Quy chuẩn điều hành**: `C:\DATA\03_Resources\tra-sua\AGENTS.md` (Mục *Mandatory Execution Protocol* và *Team Roster*).
2. **Hướng dẫn nghiệp vụ kỹ năng**:
   - `C:\Users\Admin\.agents\skills\brand\SKILL.md` (Nguyên lý phát triển nhận diện thương hiệu).
   - `C:\Users\Admin\.agents\skills\brandkit\SKILL.md` (Quy chuẩn xuất asset, kích thước icons, favicon).
   - `C:\Users\Admin\.agents\skills\ui-styling\SKILL.md` (Design tokens, CSS variables, màu sắc).
   - `C:\Users\Admin\.agents\skills\taste-skill\SKILL.md` (Thẩm mỹ thị giác, visual hierarchy).
3. **Báo cáo hoàn thành của @qa-tester**:
   - Đọc kết quả trong `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` (Xác nhận hệ thống đã đạt 100% tiêu chí di động và sẵn sàng tiếp nhận tài nguyên thương hiệu hoàn chỉnh).
4. **Kế hoạch dự án**:
   - `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (Nhiệm vụ `TSK-03`).

---

## 3. LÀM GÌ (Actionable Tasks & Detailed Scope)

Bạn phụ trách thực hiện trọn gói các công việc thiết kế và thay thế tài nguyên đồ họa sau:

### Hạng mục 1: Thiết kế Logo Vector & Bộ App Icons PWA Độc Quyền cho Dada Milktea
- **Thiết kế Logo SVG độc quyền**:
  - Tạo biểu tượng linh vật/ly trà sữa trân châu phong cách dễ thương (kawaii/chibi modern), kèm chữ **DADA MILKTEA** cách điệu nghệ thuật.
  - Lưu tệp logo vector tại `img/dada_logo.svg` và `img/dada_mascot.svg`.
- **Tạo mới và thay thế toàn bộ App Icons trong thư mục `icons/`**:
  - `icons/icon-192.png`: Biểu tượng 192x192px chuẩn PWA Android.
  - `icons/icon-512.png`: Biểu tượng 512x512px sắc nét cho màn hình độ phân giải cao.
  - `icons/icon-maskable-512.png`: Biểu tượng bo tròn thích ứng (Adaptive Maskable Icon) cho Android 13+.
  - `icons/apple-touch-icon.png`: Biểu tượng 180x180px chuẩn iOS cho iPhone và iPad.
  - `favicon.ico`: Biểu tượng nhỏ hiển thị trên tab trình duyệt máy tính.

### Hạng mục 2: Bảng Màu Thương Hiệu (Brand Design Tokens) & Bảng Hiệu Tiệm
- **Định nghĩa hệ thống CSS Tokens cho Dada Milktea**:
  - Cập nhật trong `css/style.css` các biến màu chủ đạo:
    ```css
    :root {
      --dada-brown-dark: #3E2A22;   /* Nâu trà sữa truyền thống */
      --dada-cream-milk: #F7EBE1;   /* Kem sữa béo ngậy */
      --dada-tea-amber: #D97724;    /* Màu nước trà hổ phách */
      --dada-peach: #FF8A80;        /* Hồng đào ngọt ngào */
      --dada-matcha: #81C784;       /* Xanh trà matcha */
      --dada-gold: #FFB300;         /* Vàng mật ong trân châu */
      --dada-boba-black: #1A120E;   /* Trân châu đen óng ả */
    }
    ```
- **Tùy biến bảng hiệu cửa hàng (Store Signboard)**:
  - Tinh chỉnh giao diện bảng hiệu phía trên quầy hàng từ tên cũ thành bảng hiệu phát sáng: **"TIỆM TRÀ SỮA DADA"**.

### Hạng mục 3: Cá Nhân Hóa Thực Đơn & Công Thức Đồ Uống Dada Milktea
- Cập nhật danh mục các món nước đặc trưng của thương hiệu trong `js/data.js` hoặc file công thức:
  - *Trà Sữa Truyền Thống DADA* (Trà đen đậm vị, sữa béo, trân châu hoàng kim).
  - *Trà Đào Cam Sả DADA* (Thanh mát mùa hè, đào miếng giòn).
  - *Sữa Tươi Trân Châu Đường Đen DADA* (Đường đen nấu thủ công, sữa tươi thanh trùng).
  - *Matcha Latte Đậu Đỏ DADA* (Matcha nguyên chất, kem cheese béo).

---

## 4. BÁO CÁO TEAM LEAD CÁI GÌ (Deliverables & Reporting Protocol)

Sau khi hoàn tất, bạn **bắt buộc** phải:
1. **Cập nhật tiến độ**: Đánh dấu hoàn thành (`DONE`) cho `TSK-03` trong file `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md`.
2. **Ghi biên bản nghiệm thu** vào file `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md` gồm các mục:
   - **Kỹ năng Global đã áp dụng**: Nêu rõ `Applying Skill: brand`, `Applying Skill: brandkit`, `Applying Skill: ui-styling`, `Applying Skill: taste-skill`.
   - **Bảng danh mục tài nguyên đồ họa mới**: Chi tiết kích thước, dung lượng và vị trí tệp của Logo SVG, bộ 4 App Icons PNG, favicon.
   - **Bảng mã màu Brand Tokens**: Bảng tra cứu mã màu CSS đã tích hợp.
   - **Menu đồ uống đặc sắc Dada**: Danh sách món trà sữa và công thức đã cập nhật.
   - **Bàn giao (Handoff)**: Xác nhận chuyển giao toàn bộ tài sản nhận diện hoàn tất cho `@team-lead` để thực hiện bước đóng gói phát hành cuối cùng: **TSK-07 (Đóng gói bản phát hành & Cấu hình deploy đường dẫn `dada-milktea`)**.


---

# CHỈ THỊ CÔNG VIỆC SỐ 05 - DỰ ÁN DADA MILKTEA
**Số hiệu chỉ thị**: DISPATCH-05  
**Ngày ban hành**: 2026-11-07  
**Người phát lệnh**: @team-lead (Lead AI Architect)  
**Người nhận nhiệm vụ**: @team-lead (Lead AI Architect & Release Coordinator)  
**Mục tiêu**: Đóng gói bản phát hành Production, cấu hình đa nền tảng deploy với đường dẫn `dada-milktea`, soạn cẩm nang vận hành 1-click và bàn giao sản phẩm hoàn thiện cho USER  

---

## 1. VAI TRÒ (Role)
- **Chức danh**: Tổng Chỉ Huy Kiến Trúc & Điều Phối Bản Phát Hành (Lead AI Architect & Release Coordinator).
- **Codename trong đội**: `@team-lead`.
- **Kỹ năng Global BẮT BUỘC công bố & áp dụng**:
  1. `full-stack-orchestration-full-stack-feature`: Điều phối toàn diện các lớp ứng dụng từ frontend, asset, PWA đến hạ tầng triển khai.
  2. `antigravity-skills-manager`: Quản trị hệ thống kỹ năng và kiểm soát chất lượng bàn giao.
  3. `backend-development-feature-development`: Chuẩn hóa cấu hình hosting, reverse proxy, routing và static CDN.

---

## 2. ĐỌC TÀI LIỆU GÌ (Documentation to Read)
Trước khi tiến hành, bạn **bắt buộc phải đọc kỹ các tài liệu sau**:
1. **Quy chuẩn điều hành**: `C:\DATA\03_Resources\tra-sua\AGENTS.md` (Mục *Mandatory Execution Protocol* và *Team Roster*).
2. **Hướng dẫn nghiệp vụ kỹ năng**:
   - `C:\Users\Admin\.agents\skills\full-stack-orchestration-full-stack-feature\SKILL.md` (Quy trình đóng gói bàn giao cuối cùng).
   - `C:\Users\Admin\.agents\skills\antigravity-skills-manager\SKILL.md` (Chuẩn hóa tài nguyên).
3. **Biên bản hoàn thành của toàn bộ 4 thành viên**:
   - Đọc toàn bộ báo cáo nghiệm thu trong `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md`:
     * `@scraper-deobf` (TSK-01, TSK-02): 100% tài nguyên nội bộ, JS deobfuscated sạch.
     * `@game-dev` (TSK-04, TSK-05): Tối ưu 9:16 adaptive, safe area, touch 0ms, audio unlock, PWA offline.
     * `@qa-tester` (TSK-06): Nghiệm thu thực tế trên Edge CDP đạt PASS 100% trên cả iPhone SE, iPhone 14 Pro, iPad Mini, iPad 10th.
     * `@brand-designer` (TSK-03): Bộ nhận diện Dada Milktea hoàn tất (Logo SVG, 4 icons PNG, Favicon, CSS tokens, bảng hiệu phát sáng, menu đặc sắc).
4. **Kế hoạch dự án**:
   - `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (Nhiệm vụ `TSK-07`).

---

## 3. LÀM GÌ (Actionable Tasks & Detailed Scope)

Bạn phụ trách thực hiện trọn gói các công việc đóng gói và cấu hình phát hành sau:

### Hạng mục 1: Đóng gói Bản Phát Hành Production Sạch Sẽ (Production Clean Release)
- Rà soát toàn bộ cây thư mục dự án `C:\DATA\03_Resources\tra-sua`:
  - Đảm bảo các tệp chạy chính (`index.html`, `manifest.webmanifest`, `sw.js`, `favicon.ico`, `css/`, `img/`, `icons/`, `js/`, `music/`) ở trạng thái sẵn sàng chạy production mà không cần bất kỳ build step phức tạp nào.
  - Phân tách hoặc dọn dẹp các script kiểm thử nội bộ (`local_server_test.mjs`, `run_qa_tests.mjs`, `qa_cross_device_audit.md`) vào thư mục lưu trữ kiểm định riêng, giữ cho thư mục web gọn nhẹ nhất có thể (~6.5 MB cho trọn vẹn toàn bộ game, đồ họa và âm thanh).

### Hạng mục 2: Cấu Hình Đa Nền Tảng Deploy Cho Đường Dẫn `dada-milktea`
Cung cấp sẵn các tệp cấu hình triển khai để người dùng có thể deploy web game lên bất kỳ nền tảng nào:
1. **GitHub Pages (Đường dẫn: `https://<username>.github.io/dada-milktea`)**:
   - Cung cấp tệp GitHub Actions Workflow (`.github/workflows/deploy.yml`) để tự động build và deploy lên GitHub Pages khi push code.
   - Thêm tệp `404.html` (trỏ về `index.html`) để hỗ trợ Single Page Routing mà không bị lỗi 404 khi người dùng refresh trang.
2. **Vercel / Cloudflare Pages / Netlify**:
   - Tạo tệp `vercel.json` định nghĩa header cache tối ưu (`Cache-Control`) cho tài nguyên tĩnh, và cấu hình route rewrite cho link `dada-milktea`.
   - Tạo tệp `_redirects` cho Netlify / Cloudflare Pages.
3. **Tự host qua Docker / Nginx / Node.js**:
   - Tạo `nginx.conf` và `Dockerfile` siêu nhẹ (Alpine Nginx ~15MB) cấu hình path `/dada-milktea` với nén gzip/brotli và HTTP/2.

### Hạng mục 3: Lập Tài Liệu Hướng Dẫn Vận Hành 1-Click Cho USER (`DEPLOY_GUIDE.md`)
- Soạn thảo tài liệu hướng dẫn chi tiết, trực quan bằng tiếng Việt:
  - *Cách 1*: Mở chơi ngay tức thì trên máy tính / mạng LAN nội bộ (dành cho điện thoại kết nối chung WiFi) chỉ với 1 cú click.
  - *Cách 2*: Đưa lên Internet hoàn toàn miễn phí trong 3 phút với link `dada-milktea` (hướng dẫn từng bước với GitHub Pages / Vercel).
  - *Cách 3*: Cài đặt icon Dada Milktea lên màn hình chính điện thoại (iPhone & Android) như một ứng dụng gốc (PWA Standalone).

---

## 4. BÁO CÁO CÁI GÌ (Deliverables & Final Handover)

Sau khi hoàn tất, bạn **bắt buộc** phải:
1. **Cập nhật Task Board**: Đánh dấu hoàn thành (`DONE`) cho `TSK-07` trong file `C:\DATA\03_Resources\tra-sua\.messages\TASKS.md` (100% tất cả các task TSK-01 đến TSK-07 đều đạt DONE).
2. **Ghi biên bản nghiệm thu tổng kết dự án** vào file `C:\DATA\03_Resources\tra-sua\.messages\STANDUP.md`.
3. **Bàn giao chính thức cho USER**:
   - Báo cáo tổng thể toàn bộ hành trình chuyển hóa game từ `joyup.vn/game/tiem-tra-sua-joyup` thành **Dada Milktea (`dada-milktea`)**.
   - Cung cấp bộ cấu hình deploy và hướng dẫn trải nghiệm ngay trên thiết bị di động.
