# ERP-Tesseris-react (리엑트 프론트엔드)

## CI/CD & Kubernetes 배포 환경
- GitHub Actions 기반 CI/CD 자동화
- Docker 이미지 빌드 및 푸시, 쿠버네티스 자동 배포 지원
- 배포 yaml: `my-k8s-app/final/react_deployment.yaml`, `my-k8s-app/final/react_service.yaml`

## 개발 서버 실행

1. 의존성 설치
```
npm install
```

2. 주요 라이브러리 개별 설치
```
npm install axios
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
npm install zustand
npm install @stomp/stompjs
npm install sockjs-client
npm install lucide-react
npm install @tosspayments/payment-sdk
npm install @tosspayments/tosspayments-sdk
```

3. 한 줄 설치 (복사해서 바로 실행)
```
npm install; npm install axios; npm install @mui/material @emotion/react @emotion/styled; npm install react-router-dom; npm install zustand; npm install @stomp/stompjs; npm install sockjs-client; npm install lucide-react; npm install @tosspayments/payment-sdk; npm install @tosspayments/tosspayments-sdk; npm install @mui/icons-material @mui/x-data-grid @mui/x-date-pickers dayjs gojs gojs-react recharts xlsx
```

4. 개발 서버 실행
```
npm start
```
- 기본 포트: 3000 (http://localhost:3000)

## 기타
- MUI(Material UI) 공식 문서: https://mui.com/material-ui/
- 조직도/차트/엑셀 등 추가 라이브러리:
  - gojs, gojs-react, recharts, xlsx 등
- Tailwind, autoprefixer, postcss 등은 devDependencies로 자동 설치됨


## 배포/운영
- Dockerfile, nginx.conf, .github/workflows/deploy.yml 참고
- 환경변수, API 경로 등은 배포 환경에 맞게 수정 필요

https://mui.com/material-ui/
3.npm install @mui/material @emotion/react @emotion/styled


라우터 설치 : npm install react-router-dom

4.zustan
설치방법 : npm install zustand


(웹소켓)
5.npm install @stomp/stompjs
6.npm install sockjs-client
7.npm install lucide-react
8.npm install @tosspayments/payment-sdk
한줄설치(쭉 복붙하셔서 바로 실행하시면 됩니다. mac은 다를수도)
npm install; npm install axios; npm install @mui/material @emotion/react @emotion/styled; npm install react-router-dom; npm install zustand; npm install @stomp/stompjs; npm install sockjs-client; npm install lucide-react; npm install @tosspayments/payment-sdk

npm install date-fns

운영환경 배포버전: 202507281800