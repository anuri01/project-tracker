import React, { useState } from 'react';
// import axios from 'axios';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/userStore'; // 스토어 불러오기

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const naviGate = useNavigate();
    const { setToken } = useUserStore(); // 스토어의 setToken 액션을 가져옴.

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', {username, password});

            // ** 핵심: 받은 토튼을 브라우저의 localStorage에 wjwkd
            setToken(response.data.token);

            alert('로그인 되었습니다.');
            naviGate('/'); // 로그인 성공 시 메인 홈페이지로 이동
            // window.location.reload(); // 페이지를 새로고침하여 앱 상태를 초기화
        } catch (err) {
         // 에러 핸들링 강화
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        }
    };

return (
    <div className='auth-page'>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder='사용자 이름'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                autocomplete="current-password"
                placeholder='비밀번호'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className='button-primary'>로그인</button>
        </form>
        {error && <p className='error-message'>{error}</p>}
        <p>계정이 없으신가요? <Link to='/signup'>회원가입</Link></p>
    </div>
);
}

export default LoginPage;