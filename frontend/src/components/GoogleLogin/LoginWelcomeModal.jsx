import React from 'react';
import './styles/LoginWelcomeModal.css';

export default function LoginWelcomeModal({ message, onConfirm }) {
  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>✅ 확인</button>
      </div>
    </div>
  );
}
