// src/components/common/Header.jsx

import "../../styles/common/Header.css";
import GoogleLogin from '../GoogleLogin/GoogleLogin.jsx';
import ProfileModal from '../dashboard/ProfileModal.jsx';
import { useState, useEffect } from 'react';

export default function Header({ darkMode, setDarkMode, isLogin, verify, Username, user_information, wallet_data}) {

    const [showProfileModal, setShowProfileModal] = useState(false);
    
    

    // [1] 레버리지 상태 (DB 대신 로컬 스토리지 사용)
    const [leverage, setLeverage] = useState(() => {
        // 화면 로드 시 저장된 값이 있으면 가져오고, 없으면 10으로 초기화
        const saved = localStorage.getItem('user_leverage');
        return saved ? parseInt(saved, 10) : 10;
    });
    const [showLev, setShowLev] = useState(false); 

    // [2] 코인 거래 성향 상태
    const [tendency, setTendency] = useState("공격형");
    const [showTendency, setShowTendency] = useState(false);

    // [3] 자금 및 등급 상태
    const [capital, setCapital] = useState(0);
    const [tier, setTier] = useState("Demo");

    // [4] 팝업 관련 상태
    const [showConfirm, setShowConfirm] = useState(false); 
    const [confirmType, setConfirmType] = useState(null);  
    const [pendingValue, setPendingValue] = useState(null); 

    // 유저 정보(등급, 자금, 성향) 가져오기 - DB 연동
    useEffect(() => {
        if (verify === "verified") {
            const fetchUserData = async () => {
                try {
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const response = await fetch('/api/get_user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ timezone: timezone })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        
                        // 등급, 자금, 성향은 DB 데이터 사용
                        if (data) {
                            if (data.tier) setTier(data.tier);
                            if (data.play) setTendency(data.play);
                            
                            // 레버리지는 DB에서 가져오지 않고 로컬 변수(state) 유지
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            };
            fetchUserData();
        }
    }, [verify]);

    useEffect(() => {
    if (wallet_data?.available_cash == null) return
    setCapital(wallet_data.available_cash)
    }, [wallet_data?.available_cash])

    // 성향별 색상 매핑
    const getTendencyColor = (t) => {
        if (t === "공격형") return "text-red";
        if (t === "안전형") return "text-green";
        return "text-yellow"; 
    };

    // DB 설정 저장 함수 (성향 저장용)
    const saveUserSetting = async (key, value) => {
        try {
            await fetch('/api/userinfo_modify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { [key]: value }
                })
            });
        } catch (error) {
            console.error(`Failed to save ${key}:`, error);
        }
    };

    // ★ 확인 팝업 - '예' 클릭 시 실행
    const handleConfirmYes = () => {
        if (confirmType === 'leverage') {
            setShowLev(false);
            
            // [수정] 레버리지는 DB가 아닌 로컬 스토리지에 '변수'로 저장
            localStorage.setItem('user_leverage', leverage);
            console.log("Leverage saved locally:", leverage);

        } else if (confirmType === 'tendency') {
            setTendency(pendingValue);
            setShowTendency(false);
            
            // 성향은 DB에 저장 (기존 유지)
            saveUserSetting('play', pendingValue);
        }
        setShowConfirm(false); 
    };

    // ★ 확인 팝업 - '아니오' 클릭 시 실행
    const handleConfirmNo = () => {
        if (confirmType === 'leverage') {
            // 취소 시 저장된 값으로 되돌리기 (선택 사항)
            const saved = localStorage.getItem('user_leverage');
            setLeverage(saved ? parseInt(saved, 10) : 10);
        }
        setShowConfirm(false);
    };

    const handleLoginSuccess = (response) => {
        console.log("Google Login Success:", response);
        localStorage.setItem("isLogin", "true");
        window.location.reload();
    };


    // 로그 아웃
    const handleLogout = async () => {
        const res = await fetch(`${import.meta.env.VITE_POST_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        });

        const data = await res.json();
        if (data.message == "")
        navigate("/trade");
        window.location.reload();
    };

    return (
        <div className="custom-header-content">
            <div className="mario-logo">
                <span className="text-red">투자</span>
                <div className="mario-icon-placeholder">M</div>
                <span className="text-blue">마리오</span>
            </div>

            <div className="header-spacer"></div>

            <div className="header-utils">
            {verify === null ? (
                <div className="loading">로딩 중...</div>
            ) : verify === "verified" ? (
                <>
                <div className="user-info-bar">
                    <div className="info-item">
                        <span className="label">자금:</span>
                        <span className="value">{capital.toLocaleString()} 원</span>
                    </div>
                    {/* [1] 포지션 성향 (레버리지) */}
                    <div className="info-item" style={{ 
                        position: 'relative', 
                        }}>
                    <span className="label">포지션 성향:</span>
                    <button
                        className="leverage-btn"
                        onClick={() => {
                        setShowLev(!showLev);
                        setShowTendency(false);
                        }}
                    >
                        {leverage}x
                    </button>

                    {showLev && (
                        <div className="leverage-popup">
                        <div className="lev-header">
                            <span>Leverage</span>
                            <span className="lev-val">{leverage}x</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={leverage}
                            onChange={(e) => setLeverage(e.target.value)}
                            className="lev-slider"
                        />
                        <div className="lev-marks">
                            <span>1x</span>
                            <span>50x</span>
                            <span>100x</span>
                        </div>
                        <div
                            className="popup-confirm-btn"
                            onClick={() => {
                            setConfirmType('leverage');
                            setShowConfirm(true);
                            }}
                        >
                            확인
                        </div>
                        </div>
                    )}
                    </div>

                    {/* [2] 코인 거래 성향 */}
                    <div className="info-item" style={{ position: 'relative' }}>
                    <span className="label">코인 거래 성향:</span>
                    <button
                        className={`tendency-btn ${getTendencyColor(tendency)}`}
                        onClick={() => {
                        setShowTendency(!showTendency);
                        setShowLev(false);
                        }}
                    >
                        {tendency}
                    </button>

                    {showTendency && (
                        <div className="tendency-popup">
                        {["공격형", "중립형", "안전형"].map((type) => (
                            <div
                            key={type}
                            className={`tendency-option ${tendency === type ? 'active' : ''}`}
                            onClick={() => {
                                setPendingValue(type);
                                setConfirmType('tendency');
                                setShowConfirm(true);
                            }}
                            >
                            {type}
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                    <div className="info-item">
                        <span className="label">등급:</span>
                        <span className="value badge-master">{tier}</span>
                    </div>

                    <span className="user-name"><strong>{Username}</strong>님</span>
                </div>

                <div className="divider"></div>

                <button className="icon-btn" title="내 정보 상세" onClick={() => setShowProfileModal(true)}>
                    <i className="fa-solid fa-user-gear"></i>
                </button>

                <button
                    className="icon-btn"
                    onClick={() => setDarkMode(prev => !prev)}
                    title="다크모드 토글"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
                </>
            ) : (
                <>
                <button
                    className="icon-btn"
                    onClick={() => setDarkMode(prev => !prev)}
                    title="다크모드 토글"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                <div className="login-btn-wrapper">
                    <GoogleLogin onLoginSuccess={handleLoginSuccess} />
                </div>
                </>
            )}
            </div>

            {/* 프로필 모달 */}
            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} user_information={user_information}/>
            )}

            {/* 확인 팝업 */}
            {showConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p className="confirm-msg">설정을 변경하시겠습니까?</p>
                        <div className="confirm-btns">
                            <button className="btn-yes" onClick={handleConfirmYes}>예</button>
                            <button className="btn-no" onClick={handleConfirmNo}>아니오</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}