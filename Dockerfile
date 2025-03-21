# Set nginx base image
# FROM node:18
# LABEL maintainer="Hantsy Bai"
# WORKDIR  /app
# COPY  ./dist ./dist
# COPY package.json .
# COPY package-lock.json .
# RUN  npm ci --only=production --ignore-scripts
# EXPOSE 3000
# CMD ["node", "dist/main"]

# Sử dụng Node.js làm base image
FROM node:18
LABEL maintainer="Hantsy Bai"

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json để cài dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production --ignore-scripts

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build

# Mở cổng 3000 và chạy ứng dụng
EXPOSE 3000
CMD ["node", "dist/main"]
