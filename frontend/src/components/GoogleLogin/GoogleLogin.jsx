import { useGoogleLogin } from '@react-oauth/google';
import './styles/GoogleLogin.css';
import { useEffect, useState } from 'react';

export default function GoogleLogin({ darkMode, onLoginSuccess }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 940);
  const [imgConvert, setImgConvert] = useState("../assets/Google-Sign.svg");
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 940);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && darkMode) setImgConvert("/assets/web_dark_sq_na.svg");
    else if (isMobile && !darkMode) setImgConvert("/assets/web_light_sq_na.svg");
    // 현재 DarkMode가 false일 때 기본 구글 버튼 이미지로 설정
    else if (!isMobile && darkMode) setImgConvert("../assets/Google-Sign.svg");
    else setImgConvert("../assets/Google-Sign.svg");
  }, [isMobile, darkMode]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
        if (onLoginSuccess) onLoginSuccess(codeResponse);
    },
    flow: 'auth-code',
    ux_mode: 'redirect',    
    redirect_uri: import.meta.env.VITE_REDIRECT_URL,
    onError: () => console.log("Login Failed")
  });

  return (
      <button className="login-btn" onClick={() => login()}>
          <i className="fa-solid fa-right-to-bracket"></i> 로그인
      </button>
  );
}