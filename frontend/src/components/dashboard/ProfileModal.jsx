// src/components/dashboard/ProfileModal.jsx

import React, { useEffect, useState } from 'react';
import '../../styles/dashboard/ProfileModal.css';

import Userinfo from './UserInfoModify'

export default function ProfileModal({ onClose, user_information }) {
    const [form, setForm] = useState({
        username: "",
        usemodel: "",

        email: "",

        country: "",
        interval: 14400,

        exchange: "",
        play: false,
        
        tier: "Master",     
        tier_time: 365,  
        trading_fee : 0.0,

        ticker: {
            BTC: false,
            ETH: false,
            BCH: false,
            XRP: false,
        },
  
        user_prompt: "",

        gpt_key: false,
        grok_key: false,
        // gemini_key: false,
        upbit_key: false,
        bingx_key : false,

        gpt_key_value: "",

        upbit_secret_key: "",
        upbit_access_key: "",

        bingx_secret_key: "",
        bingx_access_key: ""
    });

     // setForm 추가
    useEffect(() => {      
        const data = user_information;
        setForm(prev => ({
            ...prev,
            username: data.Username || "",
            usemodel: data.usemodel || "없음",
            
            // phone: data.phone || "",
            email: data.email || "",
            // post: data.post || "",
            country: data.country || "",
            interval: data.interval || 14400,

            trading_fee: data.trading_fee || "",
            exchange: data.exchange || "없음",
            
            play: data.play || false,
            tier: data.tier || "Master",
            tier_time: data.tier_time || 365,

            ticker: data.ticker || prev.ticker,
            
            user_prompt: data.user_prompt || "",

            gpt_key: data.gpt_key || false,

            upbit_key: data.upbit_key || false,
            bingx_key: data.bingx_access_key && data.bingx_secret_key ? true : false,    
            
            gpt_key_value: data.gpt_secret_key || "",

            upbit_access_key: data.upbit_access_key || "",
            upbit_secret_key: data.upbit_secret_key || "",

            bingx_access_key: data.bingx_access_key || "",
            bingx_secret_key: data.bingx_secret_key || "",            
        }));
    }, [user_information])
    
    const [activeTab, setActiveTab] = useState('wallet');

    const renderContent = () => {
        switch (activeTab) {
            case 'wallet':
                return (
                    <>
                        <Userinfo form={form} setForm={setForm}/>
                    </>
                );

            case 'security':
                return (
                    <>
                        <h2 className="content-title">보안 설정</h2>
                        <div className="info-box" style={{marginBottom:'15px'}}>
                            <span className="info-label">비밀번호</span>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span className="info-value">********</span>
                                <button style={{background:'#2962ff', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem'}}>변경</button>
                            </div>
                        </div>
                        <div className="info-box">
                            <span className="info-label">2단계 인증 (2FA)</span>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span className="info-value" style={{color:'#089981'}}>사용 중 (Google OTP)</span>
                                <button style={{background:'transparent', border:'1px solid #444', color:'var(--trade-text)', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem'}}>설정</button>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* 좌측 사이드바 */}
                <div className="modal-sidebar">
                    {/* <div 
                        className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fa-solid fa-user"></i> 기본 정보
                    </div> */}
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
                    {/* <div 
                        className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <i className="fa-solid fa-gear"></i> 환경 설정
                    </div> */}
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