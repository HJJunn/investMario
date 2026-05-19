# 🚀 InvestMario (투자 마리오)

> AI(LLM) 기반의 가상화폐 자동매매 및 분석 플랫폼  
> 멀티 거래소 연동, RAG 기반 시장 분석, Function Calling 에이전트를 활용하여  
> 자동 매매 및 투자 의사결정을 지원하는 AI 투자 플랫폼입니다.

---

# 📌 Overview

InvestMario는 단순 자동매매 시스템이 아닌,

- 실시간 시장 데이터 분석
- 최신 뉴스 및 용어 기반 RAG 검색
- AI 기반 투자 판단
- 사용자 투자 성향 반영
- 멀티 거래소 자동 매매

를 통합한 **Agentic AI 기반 가상화폐 투자 플랫폼**입니다.

---

# ✨ Key Features

## 🤖 AI 기반 자동 매매

LLM(Function Calling 기반)을 활용하여:

- 시장 데이터 분석
- 뉴스 분석
- 기술적 지표 분석
- 투자 성향 분석

을 수행하고 자동으로 매매 포지션을 제안합니다.

---

## 💰 멀티 거래소 지원

### 🟢 Spot Trading (현물 거래)
- Upbit API 연동
- 실시간 시세 분석
- 매수 / 매도 자동화
- 사용자 프롬프트 기반 매매 전략 생성

### 🔴 Futures Trading (선물 거래)
- BingX API 연동
- 레버리지 기반 선물 거래
- Long / Short 포지션 전략 생성
- 리스크 관리 기능 지원

---

## 📚 RAG 기반 시장 분석

최신 암호화폐 뉴스 및 기술 용어를 검색하여  
AI의 투자 판단 근거로 활용합니다.

### RAG Pipeline

```text
[사용자 요청]
      ↓
[뉴스 / 용어 검색]
      ↓
[Vector Search]
      ↓
[LLM Function Calling]
      ↓
[시장 분석 및 매매 판단]
```

### 주요 기능
- 최신 뉴스 검색
- 코인 기술 용어 설명
- 시장 이슈 분석
- AI 투자 판단 근거 제공

---

## 📊 실시간 대시보드

TradingView 차트를 연동하여:

- 실시간 시세 확인
- 포트폴리오 확인
- 수익률 확인
- 매매 내역 조회
- 시장 흐름 분석

이 가능합니다.

---

## ⚙️ 사용자 맞춤 투자 설정

사용자 투자 성향에 따라:

- 공격형
- 중립형
- 안정형

투자 전략을 다르게 적용합니다.

또한:
- 레버리지 설정
- 손절 비율 설정
- 투자 비율 설정

등을 사용자별로 설정할 수 있습니다.

---

# 🛠 Tech Stack

# Backend

| Category | Stack |
|---|---|
| Framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT, Google OAuth |
| AI | OpenAI API, Google API |
| Vector DB | FAISS |
| Agent Framework | LangChain |
| Exchange API | Upbit API, BingX API |

---

# Frontend

| Category | Stack |
|---|---|
| Framework | React (Vite) |
| Styling | CSS Modules |
| Chart | TradingView Widget |

---

# 📂 Project Structure

```bash
InvestMario/
├── backend/                     # FastAPI 백엔드
│   ├── main.py                  # 서버 진입점
│   ├── requirements.txt
│   ├── app/
│   │   ├── agent/               # AI 에이전트 (LLM, Tools, Agent Runner)
│   │   ├── api/routers/         # API 엔드포인트
│   │   ├── services/            # 외부 API (Upbit, JWT)
│   │   ├── auth/                # 인증 (JWT)
│   │   ├── database/            # DB 연결
│   │   ├── embeddings.py        # RAG 임베딩
│   │   └── common/              # 공통 유틸리티
│   ├── crypto_news_db/          # 뉴스 벡터DB (FAISS)
│   └── crypto_term_db/          # 용어 벡터DB (FAISS)
│
├── frontend/                    # React + Vite 프론트엔드
│   ├── src/
│   │   ├── pages/               # 홈, 대시보드, 거래, DAY 페이지
│   │   ├── components/          # Header, Login, ChatBot, 거래 컴포넌트
│   │   ├── services/            # API 호출, WebSocket, 데이터 처리
│   │   ├── assets/              # 이미지, 폰트
│   │   ├── styles/              # CSS (페이지별, 컴포넌트별)
│   │   ├── App.jsx & index.jsx
│   │   └── main.jsx
│   ├── public/                  # 정적 자산
│   ├── package.json
│   ├── vite.config.js
│   └── .env.development/production
│
├── README.md                    # 프로젝트 설명
├── package-lock.json            # 의존성 잠금
└── command.ps1                  # 실행 스크립트
```
---

# 📈 Main Functions

## 📌 뉴스 기반 시장 분석
- 최신 암호화폐 뉴스 수집
- 시장 이슈 분석
- 코인별 투자 심리 분석

---

## 📌 기술적 분석
- TradingView 차트 연동
- 이동평균선 분석
- RSI / MACD 기반 전략 생성

---

## 📌 Function Calling 기반 Agent
- 뉴스 검색 함수 호출
- 용어 검색 함수 호출
- 개인 포트폴리오 함수 호출
- 시장 데이터 함수 호출

LLM이 직접 필요한 기능을 선택하여 실행하는 Agent 구조로 구현했습니다.


---

# 💻 Getting Started

# Requirements

- Python 3.10+
- Node.js 18+
- PostgreSQL

---

# ⚙️ Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

## 환경 변수 설정 (.env)

```env
FERNET_KEY=FERNET_KEY
GOOGLE_CLOUDE_KEY=GOOGLE_CLOUD_KEY
GOOGLE_CLOUDE_IP=GOOGLE_CLOUD_IP

GOOGLE_OAUTH_CLIENT_ID=GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET=GOOGLE_OAUTH_CLIENT_SECRET

REDIRECT_URI=http://localhost:3500/oauth/callback

OPENAI_API_KEY=OPENAI_API_KEY

VLLM_URL=VLLM_URL

NEWS_DB_PATH=crypto_news_db
TERM_DB_PATH=crypto_term_db
```

---

# ⚙️ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# ▶️ Run

## Backend

```bash
backend\myenv313\Scripts\Activate.ps1

cd backend

python -m uvicorn main:app --host 0.0.0.0 --port 8300 --reload
```

---

## Frontend

```bash
cd frontend

npx vite
```


# 👨‍💻 My Role

- Function Calling 기반 AI Agent 설계 및 구현
- RAG 기반 뉴스 / 용어 검색 시스템 구축
- LLM 파인튜닝 및 데이터셋 구축
- 개인 Repo 👉 [https://github.com/HJJunn/investMario_chatbot](https://github.com/HJJunn/investMario_chatbot)




