// src/components/common/Header.jsx

import "../../styles/common/Header.css";
import GoogleLogin from '../GoogleLogin/GoogleLogin.jsx';
import ProfileModal from '../dashboard/ProfileModal.jsx';
import { useState } from 'react';

export default function Header({ darkMode, setDarkMode, isLogin, verify, Username }) {
    const [showProfileModal, setShowProfileModal] = useState(false);
     
    // [1] 레버리지 상태
    const [leverage, setLeverage] = useState(10); 
    const [showLev, setShowLev] = useState(false); 

    // [2] 코인 거래 성향 상태
    const [tendency, setTendency] = useState("공격형");
    const [showTendency, setShowTendency] = useState(false);

    // ★ [3] 확인 팝업 관련 상태
    const [showConfirm, setShowConfirm] = useState(false); // 팝업 노출 여부
    const [confirmType, setConfirmType] = useState(null);  // 'leverage' or 'tendency'
    const [pendingValue, setPendingValue] = useState(null); // 변경 대기 중인 값 (성향용)
    
    // 성향별 색상 매핑
    const getTendencyColor = (t) => {
        if (t === "공격형") return "text-red";
        if (t === "안전형") return "text-green";
        return "text-yellow"; 
    };

    // ★ 확인 팝업 - '예' 클릭 시 실행
    const handleConfirmYes = () => {
        if (confirmType === 'leverage') {
            // 레버리지는 슬라이더로 이미 값이 바뀌어 있으므로 창만 닫음
            setShowLev(false);
        } else if (confirmType === 'tendency') {
            // 대기 중이던 성향 값으로 변경하고 창 닫기
            setTendency(pendingValue);
            setShowTendency(false);
        }
        setShowConfirm(false); // 확인 팝업 닫기
    };

    // ★ 확인 팝업 - '아니오' 클릭 시 실행
    const handleConfirmNo = () => {
        setShowConfirm(false);
        // (선택 사항: 레버리지의 경우 취소 시 이전 값으로 되돌리는 로직을 추가할 수도 있음)
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
                    <span className="value">$10,000</span>
                    </div>

                    {/* [1] 포지션 성향 (레버리지) */}
                    <div className="info-item" style={{ position: 'relative' }}>
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
                    <span className="value badge-master">master</span>
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
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}

            {/* ★ 추가: 포지션 변경 확인 팝업 */}
            {showConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <p className="confirm-msg">포지션을 변경하시겠습니까?</p>
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