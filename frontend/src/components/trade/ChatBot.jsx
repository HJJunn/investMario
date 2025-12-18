import React, { useState, useRef, useEffect } from 'react';
import '../../styles/trade/ChatBot.css'; // 스타일 파일 임포트

export default function ChatBot() {
    // 메시지 목록 상태 (기본 환영 메시지 포함)
    const [messages, setMessages] = useState([
        { id: 1, text: "안녕하세요! 투자 마리오 AI 어시스턴트입니다. 🍄\n무엇을 도와드릴까요?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 (답변 대기)

    // 스크롤 자동 이동을 위한 Ref
    const messagesEndRef = useRef(null);

    // 메시지 추가 시 스크롤 하단 이동
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // 메시지 전송 핸들러
    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        // 1. 사용자 메시지 추가
        const newMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newMsg]);
        setInputValue("");
        setIsLoading(true);

        // 2. (임시) AI 응답 시뮬레이션 (1초 뒤 응답)
        setTimeout(() => {
            const botResponse = { 
                id: Date.now() + 1, 
                text: "죄송합니다. 아직 AI 서버와 연결되지 않았습니다.\n하지만 UI는 멋지게 바뀌었네요! 😎", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    // 엔터키 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            {/* 1. 메시지 표시 영역 */}
            <div className="chatbot-messages custom-scroll">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'my-msg' : 'bot-msg'}`}>
                        
                        {/* 봇일 경우 아이콘 표시 */}
                        {msg.sender === 'bot' && (
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
                    onKeyDown={handleKeyDown}
                />
                <button className="chat-send-btn" onClick={handleSendMessage}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
}