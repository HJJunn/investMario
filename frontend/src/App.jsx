import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css'

import Trade from './pages/trade.jsx'

import Home from './pages/home.jsx'

import Day from './pages/day/DAY.jsx'

import { useState, useEffect, useNavigate } from "react";

import { getDB } from "./components/common/OpenDB.jsx"
import GoogleRedirect from './components/GoogleLogin/GoogleRedirect.jsx';

import useGoogleVerify from './components/GoogleLogin/GoogleVerify.jsx';

function App() {
    const [ verify, setVerify] = useState(null)
    const [ name, setName] = useState("")

    // DB 테이블 생성
    useEffect(() => {
        (async () => {
            await getDB();
        })();
    }, []);

    useEffect(() => {
        const verifyGoogle = async () => {
            for (let i = 0; i < 2; i++) {

                let {result, username} = await useGoogleVerify();

                if (result == "verified") {} 
                else if (result == "expired") {
                alert("토큰이 만료되었습니다. Google 계정으로 재 로그인해주세요.");
                }
                else{
                    result = "Notverfied";
                }
                setVerify(result);
                setName(username);
                if (result) break;
                await new Promise(res => setTimeout(res, 500));
            }
        };
        verifyGoogle();
    }, []);

    useEffect(() => {
        const verifyGoogle = async () => {
            for (let i = 0; i < 2; i++) {
                const result = await useGoogleVerify();
                if (result == "verified") {

                } else if (result == "expired") {
                alert("토큰이 만료되었습니다. Google 계정으로 재 로그인해주세요.");
                }
                await new Promise(res => setTimeout(res, 500));
            }
        };

        verifyGoogle();
    }, [location]);

    const [darkMode, setDarkMode] = useState(() => {
            const saved = localStorage.getItem("darkMode");
            return saved ? JSON.parse(saved) : false; // 기본값 true
        });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/trade" replace />} />
                    <Route 
                        path="/trade" 
                        element={<Trade darkMode={darkMode} setDarkMode={setDarkMode} verify = {verify} Username = {name} />} 
                    />
                    <Route path="/oauth/callback" element={<GoogleRedirect />} />
                    <Route path="/day" element={<Day />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default App
