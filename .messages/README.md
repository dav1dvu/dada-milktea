# Workspace Messages & Team Collaboration Hub

Đây là không gian trao đổi, phân công nhiệm vụ và lưu trữ nhật ký báo cáo công việc giữa **Team Lead** và các thành viên trong đội ngũ phát triển dự án **Dada Milktea** (`dada-milktea`), clone và nâng cấp hoàn hảo từ web game gốc `https://joyup.vn/game/tiem-tra-sua-joyup`.

---

## 1. Cấu trúc thư mục `.messages/`

- **`TASKS.md`**: Bảng điều phối phân công nhiệm vụ tổng thể (Task Board) của toàn bộ dự án.
- **`STANDUP.md`**: Nhật ký báo cáo tiến độ chi tiết sau mỗi lượt làm việc của từng thành viên.
- **`DISPATCH.md`**: Chỉ thị điều phối và yêu cầu kỹ thuật trực tiếp từ Team Lead gửi đến các thành viên.

---

## 2. Quy tắc báo cáo bắt buộc sau mỗi lượt làm việc (Turn-by-Turn Protocol)

Mỗi khi một thành viên (hoặc subagent/role) hoàn thành một lượt công việc, **bắt buộc** phải ghi báo cáo vào `.messages/STANDUP.md` theo đúng mẫu chuẩn sau:

```markdown
### [BÁO CÁO] - <Tên thành viên / Codename> - <YYYY-MM-DD HH:mm>
- **Kỹ năng Global kích hoạt**: `<skill-name>` (Bắt buộc nêu rõ skill đã áp dụng)
- **Công việc đã hoàn thành**:
  - [x] Mục tiêu 1...
  - [x] Mục tiêu 2...
- **Các file đã tạo / chỉnh sửa**:
  - `path/to/file1`
  - `path/to/file2`
- **Kết quả kiểm tra & Đo lường**: (Đã test chạy local, syntax check, responsive mobile, audio...)
- **Trạng thái**: `DONE` | `IN_PROGRESS` | `BLOCKED`
- **Chuyển giao tiếp theo (Handoff)**: Bàn giao kết quả cho `@role` để thực hiện tiếp bước...
```

---

## 3. Danh sách Đội ngũ (Team Roster)

| Vai trò / Codename | Thành viên đảm nhiệm | Kỹ năng Global bắt buộc | Nhiệm vụ chính |
| :--- | :--- | :--- | :--- |
| **@team-lead** | Lead AI Architect | `antigravity-skills-manager`, `full-stack-orchestration-full-stack-feature` | Phân bổ task, review code, kiểm soát kiến trúc, báo cáo với User |
| **@scraper-deobf** | Reverse & Scraping Engineer | `web-scraping`, `js-deobfuscator`, `reverse-engineer` | Crawl trọn gói asset & code JoyUp, giải mã AST JS, gỡ bỏ JoyUp SDK |
| **@game-dev** | Mobile Web Game Engineer | `html5-game-dev`, `pwa-mobile-mastery`, `frontend-developer` | Xây dựng engine game ES modules, responsive điện thoại/tablet, Web Audio |
| **@brand-designer** | Brand & Visual Designer | `brand`, `brandkit`, `ui-styling`, `taste-skill` | Thiết kế bộ nhận diện Dada Milktea, menu đồ uống, logo, sprite đồ họa |
| **@qa-tester** | QA & Cross-device Validator | `screen-reader-testing`, `mobile-developer`, `ui-visual-validator` | Kiểm thử đa thiết bị (iOS/Android/iPad), touch latency, offline PWA |
