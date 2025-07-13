import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import useUserStore from './store/userStore'; 
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const navigate = useNavigate();
  // 로컬스토리지에서 토큰을 가져와 로그인 상태를 확인합니다. 
  // const token = localStorage.getItem('token');
  // ★★★ 핵심 변경: localStorage 대신 스토어에서 상태를 가져옴
  const { isLoggedIn, logout } = useUserStore();

  // 로그아웃 핸들러
  const handleLogout = () => {
    // localStorage.removeItem('token'); // 토큰 삭제
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/login'); // 로그인 페이지로 이동
    // window.location.reload();
  };

  return (
    <div className='container'>
      <Toaster position="top-center" toastOptions={{duration:1000,}} />
      <header>
        <div className='header-content'>
        <h1>
          <Link to="/" className='logo-link'>미니 프로젝트 관리툴</Link>
        </h1>
        <nav>
          {isLoggedIn ? ( // 스토어의 isLoggedIn 상태 사용
            // 로그인 상태일때 보여줄 메뉴
            <>
              <Link to="/">홈</Link>
              <Link to="/profile">내 프로필</Link>
              <button onClick={handleLogout} className='logout-button'>로그아웃</button>
            </>
          ) : (
            //로그아웃 상태일 때 보여줄 메뉴
            <>
              <Link to="/login">로그인</Link> 
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;