# Sử dụng Node.js làm base image
FROM node:18
LABEL maintainer="Hantsy Bai"

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy dist
COPY  ./dist ./dist

# Copy file package.json và yarn.lock để cài đặt dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "dist/main"]
