# 1단계: 빌드 환경
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
ARG REACT_APP_BASENAME
ENV REACT_APP_BASENAME=$REACT_APP_BASENAME
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ARG REACT_APP_TOSS_CLIENT_KEY
ENV REACT_APP_TOSS_CLIENT_KEY=$REACT_APP_TOSS_CLIENT_KEY
RUN npm run build

# 2단계: Nginx을 이용한 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html/react
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 