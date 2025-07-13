import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast'; // 👈 toast 함수 불러오기

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
//    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (err) {
                toast.error('사용자 정보를 불러오는데 실패했습니다.');
            }
        };
        fetchUser();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
       // setError('');

        if (newPassword !== confirmPassword) {
            toast.error('새 비밀번호와 일치하지 않습니다.');
            return;
        }

        try {
            const response = await api.put('/users/password', { oldPassword, newPassword});
            setMessage(response.data.message);
            //입력 필드 초기화
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    if(!user) {
        return <div>로딩중...</div>;
    }

    return (
        <div className='auth-page'>
            <h2>내 프로필</h2>
            <p><strong>사용자 이름:</strong>{user.username}</p>

            <hr />

            <h3>비밀번호 변경</h3>
            <form onSubmit={handlePasswordChange}>
                <input
                 className='form-input'
                 type="password"
                 placeholder='기존 비밀번호'
                 value={oldPassword}
                 onChange={(e) => setOldPassword(e.target.value)}
                 />
                <input
                 className='form-input'
                 type="password"
                 placeholder='새 비밀번호'
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 />
                <input
                 className='form-input'
                 type="password"
                 placeholder='새 비밀번호 확인'
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 />
                 <button type="submit" className='button-primary'>비밀번호 변경</button>
            </form>
            {message && <p className='success-message'>{message}</p>}
            {/* {error && <p className='error-message'>{error}</p>} */}
        </div>
    );

}

export default ProfilePage;