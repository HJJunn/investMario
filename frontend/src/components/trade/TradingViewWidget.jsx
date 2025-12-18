// src/components/trade/TradingViewWidget.jsx

import React, { useEffect, useRef, memo } from 'react';

// ★ 수정 1: symbol prop 추가 (기본값 설정)
function TradingViewWidget({ darkMode, symbol = "BINANCE:BTCUSDT" }) {
  const container = useRef();
  const theme = darkMode ? "dark" : "light";

  useEffect(() => {
    if (container.current) {
        container.current.innerHTML = ""; 
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // ★ 수정 2: symbol 변수를 설정값에 반영
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}", 
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "${theme}",
        "style": "1",
        "locale": "kr",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);
    
    // ★ 수정 3: symbol이 바뀔 때마다 useEffect 재실행
  }, [theme, symbol]); 

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);