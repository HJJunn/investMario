import './styles/UserInfoModify.css'
import { useState, useEffect } from 'react';
import CountrySelect from './services/countryselect'
import {User_Infor_Modify} from './services/user_inforamtion'
export default function Userinfo({ form, setForm }) {
  // 키별 눈 표시 상태
  const [showKeys, setShowKeys] = useState({
    gpt: false,

    upbit_secret: false,
    upbit_access: false,

    bingx_secret : false,
    bingx_access : false,
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const updateTicker = (coin) => setForm(prev => ({
    ...prev,
    ticker: { ...prev.ticker, [coin]: !prev.ticker[coin] },
  }));

  const toggleShowKey = (key) => setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));

  const keyFields = [

    { label: "GPT", value: form.gpt_key_value, status: form.gpt_key, keyName: "gpt" },

    { label: "Upbit Access", value: form.upbit_access_key, status: form.upbit_key, keyName: "upbit_access" },
    { label: "Upbit Secret", value: form.upbit_secret_key, status: form.upbit_key, keyName: "upbit_secret" },
    { label: "Bingx Access", value: form.bingx_access_key, status: form.bingx_key, keyName: "bingx_access" },
    { label: "Bingx Secret", value: form.bingx_secret_key, status: form.bingx_key, keyName: "bingx_secret" },    
  ];

  const validateFormForRun = () => {
    // exchange
    if (!form.exchange) {
      alert("거래소를 선택해주세요.");
      return false;
    }

    // model
    if (!form.usemodel) {
      alert("모델을 선택해주세요.");
      return false;
    }

    // model key
    if (form.usemodel.startsWith("GPT")) {
      if (!form.gpt_key_value) {
        alert("GPT API Key를 입력해주세요.");
        return false;
      }
    }

    // exchange key
    if (form.exchange === "Upbit") {
      if (!form.upbit_access_key || !form.upbit_secret_key) {
        alert("Upbit Access / Secret Key를 모두 입력해주세요.");
        return false;
      }
    }

    return true;
  };

  const handlePlayToggle = () => {
    if (form.play) {
      update("play", false);
      return;
    }

    if (!validateFormForRun()) return;

    update("play", true);
  };

  return (
    <div className="user">
      <div className="user-information">
        <h2>User Information</h2>

        {/* Use Model */}
        <div className="toggle-group">
          <label>Use Model</label>
          <div className="ticker-list">
            {[
              { key: "GPT_5.0_mini", label: "GPT-5-mini" },
              { key: "Grok_3.0_mini", label: "Grok-3.0-mini" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`toggle-btn ${form.usemodel === key ? "on" : ""}`}
                onClick={() => update("usemodel", key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div className="form-group">
          <CountrySelect form={form} update={update}/>
        </div>

        {/* Interval */}
        <div className="toggle-group">
          <label>Interval (sec)</label>
          <div className="ticker-list">
            {[14400, 86400].map((sec) => (
              <button
                key={sec}
                type="button"
                className={`toggle-btn ${form.interval === sec ? "on" : ""}`}
                onClick={() => update("interval", sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange */}
        <div className="toggle-group">
          <label>Select Exchange</label>
          <div className="ticker-list">
            {[
              // "Bithumb", 
              "Upbit"].map((ex) => (
              <button
                key={ex}
                type="button"
                className={`toggle-btn ${form.exchange === ex ? "on" : ""}`}
                onClick={() => update("exchange", ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Trading Fee */}
        <div className="form-group">
          <label>Trading Fee</label>
          <div className="input-with-unit">
            <input
              type="text"
              placeholder="0.1"
              value={form.trading_fee}
              onChange={(e) => update("trading_fee", e.target.value)}
            />
            <span>%</span>
          </div>
        </div>

        {/* Tier */}
        <div className="form-group">
          <label>Tier : {form.tier}</label>
        </div>

        {/* Tier Time */}
        <div className="form-group">
          <label>Tier duration : {form.tier_time} day</label>
        </div>

        {/* Ticker toggles */}
        <div className="toggle-group">
          <label>Select Tickers</label>
          <div className="ticker-list">
            {Object.keys(form.ticker).map((coin) => (
              <button
                key={coin}
                className={`toggle-btn ${form.ticker[coin] ? "on" : ""}`}
                onClick={() => updateTicker(coin)}
              >
                {coin}
              </button>
            ))}
          </div>
        </div>

        {/* Keys display */}
        <div className="toggle-group">
          <label>Keys</label>
          <div className="ticker-list">
            {keyFields.map((k, idx) => (
              <div key={idx} 
              className='ticker-form'>
                <button className={`key-toggle ${k.status ? "on" : ""}`}>
                  {k.label} {k.status ? "ON" : "OFF"}
                </button>
                <div 
                className='key-form'
                >
                  <input
                    type={showKeys[k.keyName] ? "text" : "password"}
                    value={k.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (k.keyName === "grok") update("grok_key_value", val);
                      else if (k.keyName === "gpt") update("gpt_key_value", val);
                      
                      else if (k.keyName === "upbit_access") update("upbit_access_key", val);
                      else if (k.keyName === "upbit_secret") update("upbit_secret_key", val);

                      else if (k.keyName === "bingx_access") update("bingx_access_key", val);
                      else if (k.keyName === "bingx_secret") update("bingx_secret_key", val);                      
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      backgroundColor: "var(--bg-color)",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    onClick={() => toggleShowKey(k.keyName)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showKeys[k.keyName] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4a76e8" viewBox="0 0 24 24">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                        <circle cx="12" cy="12" r="2.5"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#aaa" viewBox="0 0 24 24">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7c1.7 0 3.28-.35 4.7-.97l1.62 1.62 1.41-1.41-1.5-1.5c2.05-1.53 3.38-3.54 3.38-3.54s-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5 0-.54.1-1.06.28-1.54l6.26 6.26c-.48.18-1 .28-1.54.28z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}


        </div>            
          </div>

        <h2>User Prompt</h2>
        <textarea
          className="user-prompt"
          value={form.user_prompt}
          placeholder="Type your prompt here..."
          onChange={(e) => {
            const input = e.target.value;
            if (input.length > 2000) {
              alert("최대 2000자까지 입력 가능합니다.");
              return;
            }
            update("user_prompt", input);
          }}
        />     
        </div>

        
        <div className="toggle-group">
          <button 
              className={`toggle-btn ${form.play ? "on" : ""}`}
              onClick={handlePlayToggle}
              style={{ width: "100%", marginBottom: "15px" }}
            >
              {form.play ? "Play ON" : "Play OFF"}
          </button>

        <button 
        className="save-btn" 
        onClick={() => {
          if (!validateFormForRun()) return;
          User_Infor_Modify(form);
        }}>
          Save
        </button>
      </div>
    </div>
  );
}
