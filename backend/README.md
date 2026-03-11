Backend Setup Guide for Frontend

1. Cài đặt phần mềm cần thiết

Docker + Docker Compose

Kiểm tra Docker đã cài thành công:

docker --version
docker compose version

2. Chạy Docker

Trong thư mục project chạy:

docker compose up --build

Docker sẽ tự động:

Tạo container database

Tạo container backend

Kết nối backend với database

Chạy server API

3. Kiểm tra backend đã chạy

Mở trình duyệt:

http://localhost:8000/docs

Đây là Swagger UI để test API.

7. Dừng server

Trong terminal nhấn:

Ctrl + C

hoặc chạy:

docker compose down

8. Chạy lại backend

Nếu đã build trước đó:

docker compose up
