# QueueStream MVP

Một MVP sẵn sàng triển khai cho ứng dụng quản lý hàng chờ, cho phép streamer tạo phiên livestream, người xem tham gia hàng chờ và mọi người nhìn thấy trạng thái cập nhật theo thời gian thực.

## Công nghệ

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client
- Backend: Python Flask, Flask-JWT-Extended, Flask-SocketIO, SQLAlchemy, Flask-CORS
- Cơ sở dữ liệu: PostgreSQL
- Triển khai: Frontend trên Vercel, backend và database trên Railway

## Tính năng

- Đăng nhập bằng Google OAuth
- Hoàn thiện hồ sơ với tên trong game và UID game
- Quản lý livestream cho streamer
- Luồng tham gia/rời hàng chờ cho người xem
- Cập nhật hàng chờ trực tiếp qua Socket.IO
- Phân quyền theo vai trò streamer, viewer và admin

## Phát triển cục bộ

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set FLASK_APP=wsgi.py
flask run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Môi trường

Sao chép file env mẫu và cấu hình:

- Google OAuth client ID
- JWT secret
- Database URL
- API base URL

## Ghi chú

- Backend dùng SQLAlchemy ORM với kiến trúc service/repository.
- Vị trí trong hàng chờ được tính lại tự động sau mỗi thay đổi.
- Socket.IO giúp các client đang kết nối luôn đồng bộ mà không cần tải lại trang.
