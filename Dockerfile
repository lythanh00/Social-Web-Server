# Set nginx base image
# Sử dụng Node.js làm base image
FROM node:18
LABEL maintainer="Hantsy Bai"

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và yarn.lock để cài đặt dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN yarn build

# Mở cổng 3000 và chạy ứng dụng
EXPOSE 3000
CMD ["node", "dist/main"]

