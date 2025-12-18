import "./styles/WelcomeModal.css";

export default function WelcomeModal({ onConfirm }) {
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <div className="emoji">🎉😊</div>
        <h2>반가워요!</h2>
        <p>CoinSect에 오신 걸 환영합니다.<br/>간단한 계정 정보를 입력해주세요!</p>

        <button className="welcome-confirm-btn" onClick={onConfirm}>
          시작하기
        </button>
      </div>
    </div>
  );
}
