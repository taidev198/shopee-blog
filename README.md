# Lập Nghiệp Shopee — khoá học có phân quyền

Next.js (App Router, server rendering). Không cần backend riêng.

- Khách: xem thử 10 giây đầu mỗi video, tài liệu bị khoá.
- Đăng ký → trang thanh toán (QR VietQR) → bấm "Tôi đã chuyển khoản" → admin duyệt ở `/admin` → xem đầy đủ.

## Biến môi trường (xem `.env.example`)

| Biến | Ý nghĩa |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối Postgres (Neon / Supabase / Render Postgres). **Bắt buộc khi deploy** |
| `AUTH_SECRET` | Chuỗi ngẫu nhiên ký cookie đăng nhập (`openssl rand -base64 32`). **Bắt buộc khi deploy** |
| `ADMIN_EMAIL` | Email admin (nhiều email cách nhau dấu phẩy). Đăng ký tài khoản bằng email này để vào `/admin` |
| `COURSE_PRICE` | Giá khoá học (số tiền, VNĐ) |

Bảng `users` được tạo tự động ở lần chạy đầu.

## Chạy local

```bash
cp .env.example .env.local   # để trống DATABASE_URL => dùng DB nhúng trong ./.data
npm install
npm run dev
```

## Deploy

- **Vercel**: import repo, thêm các biến môi trường ở trên.
- **Render**: Web Service, build `npm install && npm run build`, start `npm run start`, thêm các biến môi trường.

Ảnh số tài khoản: mặc định là `public/stk-default.svg` (ảnh mẫu). Đặt ảnh thật vào `public/stk.png` (hoặc .jpg/.jpeg/.webp) để thay thế; trang `/payment` hiển thị kèm nội dung chuyển khoản riêng của từng học viên.
