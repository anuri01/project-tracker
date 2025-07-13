import { create } from 'zustand';

// create를 함수를 사용해 스토어를 만듬
const useUserStore = create((set) => ({
    // --- 상태(state) ----
    token: localStorage.getItem('token') || null, // 앱 시작시 로컬 스토리지의 토큰을 가죠옴
    isLoggedIn: !!localStorage.getItem('token'), // 토튼이 있으면 true, 없으면 false

    // --- 액션 (action) ---
    // 토큰을 설정하고 로그인 상태를 true로 바꾸는 함수
    setToken: (token) => {
        localStorage.setItem('token', token);
        set( { token: token, isLoggedIn: true });
    },

    // 토큰을 제거하고 로그아웃 상태로 바꾸는 함수
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isLoggedIn: false });
  },

}));

export default useUserStore; // 👈 이 부분이 중요합니다.