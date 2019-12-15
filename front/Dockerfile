# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY ./ /app/
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# docker build --rm -f "front\Dockerfile" -t catholink:latest "front"
# docker run --rm -d -p 80:80/tcp catholink:latest