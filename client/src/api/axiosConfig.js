import axios from 'axios';

// VITE_API_URL은 Vercel에 설정한 환경 변수입니다.
// 개발 환경(.env.local)에서는 localhost, 배포 환경에서는 Render 서버 주소를 가리킵니다.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 1. axios 인스턴스 생성
const instance = axios.create({
    baseURL: baseURL
});

// 2. 요청 인터셉터(interceptor) 설정
instance.interceptors.request.use(
    (config) => {
        // localStorage에서 토큰을 가져옵니다.
        const token = localStorage.getItem('token');
        
        // 토큰이 존재하면, 모든 요청의 헤더에 토큰을 추가합니다.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;