# Sử dụng Node.js làm base image
FROM node:18
LABEL maintainer="Hantsy Bai"

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và cài đặt dependencies
COPY package.json .
RUN npm install --only=production

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng để tạo thư mục dist
RUN npm run build

# Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "dist/main"]
