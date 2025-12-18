import React, { useState, useRef, useEffect } from 'react';
import '../../styles/trade/ChatBot.css';

export default function ChatBot() {
    
    const [messages, setMessages] = useState([
        { type: 'bot', text: '안녕하세요! 무엇을 도와드릴까요? (뉴스, 포트폴리오 분석, 내 정보 등)' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // 스크롤 자동 이동용 Ref
    const messagesEndRef = useRef(null);

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // 메시지 전송 핸들러
    const handleSendMessage = async (e) => {
        // ★ 수정 1: 이벤트 객체(e)가 있을 때만 preventDefault 실행
        if (e) e.preventDefault();
        
        if (!inputValue.trim() || isLoading) return;

        // 1. 사용자 메시지 화면에 추가
        const userMsg = inputValue;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInputValue("");
        setIsLoading(true);

        try {
            // 2. 백엔드로 메시지 전송
            // ★ 수정 2: 올바른 API 엔드포인트로 변경 (/api/agent/chat)
            const res = await fetch(`${import.meta.env.VITE_POST_URL}/api/agent/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // 쿠키(JWT) 전송
                body: JSON.stringify({ message: userMsg }), 
            });

            const data = await res.json();
            console.log(data)

            if (res.ok) {
                // 3. 봇 응답 추가
                const botResponse = data.answer || data.response || data.message || "응답을 처리할 수 없습니다.";
                setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: `오류 발생: ${data.detail || '서버 에러'}` }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { type: 'bot', text: "서버 연결에 실패했습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // ★ 수정 3: handleKeyDown 함수가 반드시 return 문보다 위에 있어야 합니다.
    const handleKeyDown = (e) => {
        // 한글 입력 중 엔터키 입력 시 이벤트 중복 방지 (isComposing)
        if (e.nativeEvent.isComposing) return;

        if (e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    return (
        <div className="chatbot-container">
            {/* 1. 메시지 표시 영역 */}
            <div className="chatbot-messages custom-scroll">
                {messages.map((msg, idx) => (
                    // key 값은 고유해야 하므로 idx 사용 (실제론 id 권장)
                    <div key={idx} className={`message-row ${msg.type === 'user' ? 'my-msg' : 'bot-msg'}`}>
                        
                        {/* 봇일 경우 아이콘 표시 */}
                        {msg.type === 'bot' && (
                            <div className="bot-avatar">
                                <i className="fa-solid fa-robot"></i>
                            </div>
                        )}

                        {/* 말풍선 */}
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* 로딩 표시 (... 애니메이션) */}
                {isLoading && (
                    <div className="message-row bot-msg">
                        <div className="bot-avatar"><i className="fa-solid fa-robot"></i></div>
                        <div className="message-bubble loading-bubble">
                            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                        </div>
                    </div>
                )}
                
                {/* 스크롤 하단 앵커 */}
                <div ref={messagesEndRef} />
            </div>

            {/* 2. 입력 영역 */}
            <div className="chatbot-input-area">
                <input 
                    type="text" 
                    className="chat-input"
                    placeholder="질문을 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} // 여기서 함수를 찾지 못해 에러가 났었습니다.
                />
                <button className="chat-send-btn" onClick={handleSendMessage}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
}