// src/components/dashboard/ProfileModal.jsx

import React, { useState } from 'react';
import '../../styles/dashboard/ProfileModal.css';

export default function ProfileModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <>
                        <h2 className="content-title">내 프로필</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div className="profile-info">
                                <h3>MASTER <span className="badge-master">MASTER</span></h3>
                                <p>가입일: 2025-01-01</p>
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-box">
                                <span className="info-label">이메일</span>
                                <span className="info-value">master@investmario.com</span>
                            </div>
                            <div className="info-box">
                                <span className="info-label">휴대폰 번호</span>
                                <span className="info-value">010-1234-5678</span>
                            </div>
                            <div className="info-box">
                                <span className="info-label">투자 성향</span>
                                <span className="info-value" style={{color:'#f23645'}}>공격투자형 (Aggressive)</span>
                            </div>
                            <div className="info-box">
                                <span className="info-label">총 자산</span>
                                <span className="info-value">$10,000.00</span>
                            </div>
                        </div>
                    </>
                );
            case 'security':
                return (
                    <>
                        <h2 className="content-title">보안 설정</h2>
                        <div className="info-box" style={{marginBottom:'10px'}}>
                            <span className="info-label">비밀번호</span>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span className="info-value">********</span>
                                <button style={{background:'#2962ff', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>변경</button>
                            </div>
                        </div>
                        <div className="info-box">
                            <span className="info-label">2단계 인증 (2FA)</span>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span className="info-value" style={{color:'#089981'}}>사용 중 (Google OTP)</span>
                                <button style={{background:'transparent', border:'1px solid #444', color:'var(--trade-text)', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>설정</button>
                            </div>
                        </div>
                    </>
                );
            default:
                return <div>준비 중인 기능입니다.</div>;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* 좌측 사이드바 */}
                <div className="modal-sidebar">
                    <div 
                        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fa-solid fa-user"></i> 기본 정보
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'wallet' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wallet')}
                    >
                        <i className="fa-solid fa-wallet"></i> 계좌 정보
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="fa-solid fa-shield-halved"></i> 보안 설정
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <i className="fa-solid fa-gear"></i> 환경 설정
                    </div>
                </div>

                {/* 우측 콘텐츠 */}
                <div className="modal-content">
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}