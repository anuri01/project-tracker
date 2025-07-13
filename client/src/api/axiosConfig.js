import axios from 'axios';

// 1. axios 인스턴스 생성
const instance = axios.create({
    baseURL: 'http://localhost:3000/api' // 모든 요청의 기본 URL
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