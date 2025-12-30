// src/components/trade/TopStats.jsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';


import useUpbitData from './services/Upbit'

// 코인 아이콘
const coinIcons = {
    BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025",
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
    XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=025",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.png?v=025",
    DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=025",
    ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=025",
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=025",
};

const API_CONFIG = {
    "uri": "/openApi/swap/v2/user/positions",
    "method": "GET",
    "payload": {
        "symbol": "BTC-USDT" // 원하는 심볼로 변경 가능
    },
};

function getParameters(API, timestamp, urlEncode = false) {
    let parameters = "";
    for (const key in API.payload) {
        if (Object.prototype.hasOwnProperty.call(API.payload, key)) {
            const value = API.payload[key];
            if (urlEncode) {
                parameters += key + "=" + encodeURIComponent(value) + "&";
            } else {
                parameters += key + "=" + value + "&";
            }
        }
    }

    if (parameters) {
        parameters = parameters.substring(0, parameters.length - 1);
        parameters = parameters + "&timestamp=" + timestamp;
    } else {
        parameters = "timestamp=" + timestamp;
    }
    return parameters;
}

async function fetchBingXPositions(API_KEY, API_SECRET) {

    if (!API_KEY || !API_SECRET) {
        throw new Error("API Key/Secret이 설정되지 않았습니다.");
    }

    const timestamp = new Date().getTime();

    // 1. Signature 생성
    const parameterString = getParameters(API_CONFIG, timestamp);
    const sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(parameterString, API_SECRET));

    // 2. 최종 URL 생성 (프록시 경로를 사용: /api + URI + 쿼리)
    const url = 
        API_CONFIG.uri + 
        "?" + 
        getParameters(API_CONFIG, timestamp, true) + 
        "&signature=" + sign;

    const config = {
        method: API_CONFIG.method,
        url: `/bingx${url}`, 
        headers: {
            'X-BX-APIKEY': API_KEY,
        },
        transformResponse: (resp) => {
            // BigInt 이슈 처리 (15자리 이상 숫자를 문자열로 변환하여 파싱)
            const jsonWithBigIntToString = resp.replace(/:(\d{15,})(?=[,}\]])/g, (_, p1) => `:"${p1}"`);
            try {
                 return JSON.parse(jsonWithBigIntToString);
            } catch (e) {
                 console.error("JSON 파싱 오류", e);
                 return { code: -1, msg: "JSON 파싱 오류", originalResponse: resp }; 
            }
        }
    };

    const resp = await axios(config);
    return resp.data;
}

export default function TopStats({ isLogin, analzeData, walletData, user_information }) {

    const [position, setPosition] = useState({})
    const [owner_coin, setOwner_Coin] = useState({})

    const [trade_coin, setTrade_Coin] = useState({})
    const [_time, setTime] = useState("")

    const API_KEY = user_information['bingx_access_key'];
    const API_SECRET = user_information['bingx_secret_key'];
  
    const prevAnalzeRef = useRef(null);
    const prevWalletRef = useRef(null);

    const [positionData, setPositionData] = useState([]);
    const [loadingPositions, setLoadingPositions] = useState(true);
    const [positionError, setPositionError] = useState(null);

    const [currentOwnerValue, setCurrentOwner] = useState({});


    // Upbit Current Price Data
    const currentPrice = useUpbitData(walletData && Object.keys(walletData).length ? walletData : null);


    // 승엽님 hook
    useEffect(() => {
        if (!isLogin) {
             setPositionData([]);
             setLoadingPositions(false);
             setPositionError(null);
             return; 
        }

        const fetchAndSetPositions = () => {
             // 데이터 로딩 로직 (이전과 동일)
             fetchBingXPositions(API_KEY, API_SECRET)
                .then(result => {
                    if (result.code === 0) {
                        const transformedData = (result.data || []).map(pos => {
                            const unrealizedProfit = parseFloat(pos.unrealizedProfit);
                            const realizedProfit = parseFloat(pos.realisedProfit);
                            const coinSymbol = pos.symbol.split('-')[0];

                            return {
                                coin: coinSymbol, 
                                type: pos.positionSide === 'LONG' ? '매수' : '매도', 
                                entry: parseFloat(pos.avgPrice).toLocaleString(), 
                                amount: parseFloat(pos.positionAmt).toLocaleString(undefined, { maximumFractionDigits: 4 }), 
                                pnl: `${unrealizedProfit >= 0 ? '+' : ''}${unrealizedProfit.toFixed(4)}`, 
                                realizedPnl: `${realizedProfit >= 0 ? '+' : ''}${realizedProfit.toFixed(4)}`, 
                                liquidationPrice: parseFloat(pos.liquidationPrice).toFixed(4), 
                                isWin: unrealizedProfit >= 0,
                                isRealizedWin: realizedProfit >= 0,
                                leverage: pos.leverage,
                            };
                        });
                        setPositionData(transformedData);
                        setPositionError(null);
                    } else {
                        setPositionError(`API 오류 (Code: ${result.code}): ${result.msg}`);
                    }
                })
                .catch(err => {
                    console.error("Position Fetch Error:", err);
                    setPositionError(`데이터 로드 실패: ${err.message}`);
                })
                .finally(() => {
                    setLoadingPositions(false);
                });
        };

        // 1. 컴포넌트 마운트 시 즉시 한 번 호출
        fetchAndSetPositions();

        // 2. ★ 1초(1000ms)마다 주기적으로 호출하여 업데이트 ★
        const intervalId = setInterval(fetchAndSetPositions, 3000); 

        // 3. 클린업 함수: 컴포넌트가 언마운트되거나 useEffect가 다시 실행될 때 타이머를 해제
        return () => clearInterval(intervalId);

    }, [API_KEY, API_SECRET, isLogin]); // isLogin 상태가 변경될 때만 다시 실행

    
    useEffect(() => {
        if (!analzeData) return;
    
        if (prevAnalzeRef.current &&
            JSON.stringify(prevAnalzeRef.current) === JSON.stringify(analzeData)
        ) {
            return; // 완전히 같으면 아무 것도 안 함
        }

        const keys = Object.keys(analzeData);

        keys.forEach(key => {
            const value = analzeData[key];

            setPosition(value.position[value.position.length - 1]);

            const rawTime = value.time[value.time.length - 1];

            const localTime = new Date(rawTime).toLocaleString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            setTime(localTime);
        });
        prevAnalzeRef.current = analzeData;
   
    }, [analzeData]);

    // Ref로 호출 제한
    useEffect(() => {
        if (!walletData) return;

        if (prevWalletRef.current &&
            JSON.stringify(prevWalletRef.current) === JSON.stringify(walletData)
        ) {
            return;
        }

        const keys = Object.keys(walletData);

        keys.forEach(key => {
            const value = walletData[key];
            setOwner_Coin(value.owner_coin[value.owner_coin.length-1]);

            let current_owner_coin = value.owner_coin[value.owner_coin.length-1]
            let pre_owner_coin = value.owner_coin[value.owner_coin.length-2]
            
            const coinDifference = {};
            Object.keys(current_owner_coin).forEach((key) => {
            coinDifference[key] =
                Number((current_owner_coin[key] - pre_owner_coin[key]).toFixed(8));
            });
            setTrade_Coin(coinDifference);
        });
        prevWalletRef.current = walletData;
    
    }, [walletData])

    const prevPriceRef = useRef({});
    useEffect(() => {
        if (!owner_coin || !currentPrice) return;

        // 값이 실제로 달라졌을 때만 계산
        if (JSON.stringify(prevPriceRef.current) !== JSON.stringify(currentPrice)) {
            // 곱해서 평가금액 계산 (정수로)
            const newOwnerValue = {};
            Object.keys(owner_coin).forEach(coin => {
                if (currentPrice[coin] !== undefined) {
                    newOwnerValue[coin] = Math.floor(owner_coin[coin] * currentPrice[coin]);
                }
            });

            setCurrentOwner(newOwnerValue);
            prevPriceRef.current = currentPrice;
        }
    }, [currentPrice, owner_coin]);
    

    useEffect(() => {
        if (!position || !trade_coin) return;

        const updatedTradeCoin = { ...trade_coin };

        Object.keys(position).forEach((key) => {
            if (position[key] === "sell" && trade_coin[key] === 0) {
                updatedTradeCoin[key] = "최소";
            }
        });

        setTrade_Coin(updatedTradeCoin);

    }, [position]);

    // 1. 청산 현황
    const statsData = [
        { label: "1시간 청산", short: "1.30M", long: "8.04M", total: "9.34M" },
        { label: "4시간 청산", short: "3.49M", long: "13.77M", total: "17.26M" },
        { label: "12시간 청산", short: "46.44M", long: "72.20M", total: "118.64M" },
        { label: "24시간 청산", short: "106.65M", long: "94.41M", total: "201.06M" },
    ];

    // 3. [현물] 보유 코인 데이터
    const holdingData = [
        { coin: "BTC", amount: owner_coin['BCH'], roe: "+12.5%", value: currentOwnerValue.BTC, isWin: true },
        { coin: "ETH", amount: owner_coin['ETH'], roe: "+5.2%", value: currentOwnerValue.ETH, isWin: true },
        { coin: "XRP", amount: owner_coin['XRP'], roe: "-2.1%", value: currentOwnerValue.XRP, isWin: false },
        { coin: "BCH", amount: owner_coin['BCH'], roe: "-2.1%", value: currentOwnerValue.BCH, isWin: false },
        { coin: "SOL", amount: owner_coin['SOL'], roe: "-2.1%", value: currentOwnerValue.SOL, isWin: false },                
    ];

    // 4. 통합 거래 내역 (★ category 항목 추가됨)
    const historyData = [
        { time: _time, coin: "BTC", market: "KRW", category: "현물", type: position['BTC'], qty: trade_coin['BTC'], isBuy: true },
        { time: _time, coin: "ETH", market: "KRW", category: "현물", type: position['ETH'], qty: trade_coin['ETH'], isBuy: false },
        { time: _time, coin: "XRP", market: "KRW", category: "현물", type: position['XRP'], qty: trade_coin['XRP'], isBuy: true },
        { time: _time, coin: "SOL", market: "KRW", category: "현물", type: position['SOL'], qty: trade_coin['SOL'], isBuy: true },
        { time: _time, coin: "BCH", market: "KRW", category: "현물", type: position['BCH'], qty: trade_coin['BCH'], isBuy: false },
    ];

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            gap: '10px',
        },
        cardsArea: {
            flex: 0.7, 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
        },
        rightArea: {
            flex: 1.3, 
            display: 'flex',
            gap: '10px',
        },
        
        // 박스 공통 스타일
        card: {
            backgroundColor: 'var(--trade-card-bg)',
            border: '1px solid var(--trade-border)', 
            borderRadius: '4px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontSize: '0.8rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        },
        historyBox: {
            flex: 1,
            backgroundColor: 'var(--trade-card-bg)',
            border: '1px solid var(--trade-border)', 
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },

        // --- 텍스트 스타일 ---
        title: {
            fontSize: '0.9rem',
            color: 'var(--trade-text)', 
            marginBottom: '8px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        row_long: {
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            backgroundColor: 'var(--trade-bg)', 
            padding: '6px 10px',
            borderRadius: '2px',
            alignItems: 'center',
        },
        row_short: {
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            backgroundColor: 'var(--trade-bg)', 
            padding: '6px 10px',
            borderRadius: '2px',
            alignItems: 'center',
        },
        row_total: {
            fontSize: '0.85rem',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2px',
            marginTop: '5px',
            color: 'var(--trade-subtext)', 
        },
        shortText: { color: '#f23645', fontWeight: 'bold' }, 
        longText: { color: '#089981', fontWeight: 'bold' },  
        totalText: { fontSize: '1rem', fontWeight: 'bold', color: 'var(--trade-text)' }, 

        // --- 테이블 헤더 ---
        sectionHeader: {
            padding: '8px 10px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            borderBottom: '1px solid var(--trade-border)',
            backgroundColor: 'var(--trade-card-bg)',
            color: 'var(--trade-text)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        
        // 포지션 헤더
        posHeader: {
            display: 'grid',            
            // 코인 | Side | 진입가 | 수량 | 미실현 | 실현 | 청산가
            gridTemplateColumns: '0.7fr 0.6fr 1fr 0.8fr 1fr 1fr 1fr',  
            padding: '6px 0', fontSize: '0.65rem', fontWeight: 'bold',
            backgroundColor: 'var(--trade-bg)', borderBottom: '1px solid var(--trade-border)',
            color: 'var(--trade-subtext)', textAlign: 'center', 
        },
        // 보유코인 헤더
        holdHeader: {
            display: 'grid',
            gridTemplateColumns: '0.9fr 0.9fr 1.2fr', 
            padding: '6px 0', fontSize: '0.65rem', fontWeight: 'bold',
            backgroundColor: 'var(--trade-bg)', borderBottom: '1px solid var(--trade-border)',
            color: 'var(--trade-subtext)', textAlign: 'center', 
        },
        // ★ 거래내역 헤더 (6개 컬럼으로 변경)
        histHeader: {
            display: 'grid',
            // 시간 | 코인 | 마켓 | 구분 | 종류 | 수량
            gridTemplateColumns: '0.7fr 0.8fr 0.6fr 0.6fr 0.6fr 0.8fr', 
            padding: '6px 0', fontSize: '0.65rem', fontWeight: 'bold',
            backgroundColor: 'var(--trade-bg)', borderBottom: '1px solid var(--trade-border)',
            color: 'var(--trade-subtext)', textAlign: 'center', 
        },

        tableRow: {
            display: 'grid',
            padding: '4px 0',
            fontSize: '0.7rem',
            borderBottom: '1px solid var(--trade-border)',
            alignItems: 'center',
            transition: 'background-color 0.2s',
            cursor: 'default',
            textAlign: 'center',
        },
        
        coinWrapper: {
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', fontWeight: 'bold',
        },
        coinIcon: { width: '12px', height: '12px', borderRadius: '50%' },
        
        // 배지 스타일
        badgeLong: {
            backgroundColor: 'rgba(8, 153, 129, 0.15)', color: '#089981',
            padding: '1px 3px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold'
        },
        badgeShort: {
            backgroundColor: 'rgba(242, 54, 69, 0.15)', color: '#f23645',
            padding: '1px 3px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold'
        },
        // ★ 구분(선물/현물) 배지 스타일
        badgeSpot: {
            backgroundColor: 'rgba(41, 98, 255, 0.1)', color: '#2962ff',
            padding: '1px 3px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold'
        },
        badgeFuture: {
            backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800',
            padding: '1px 3px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 'bold'
        },

        pnlWin: { color: '#089981', fontWeight: 'bold' },
        pnlLose: { color: '#f23645', fontWeight: 'bold' },
    };

    // [1] 현물 포지션
    const renderPositionTable = () => (
        <div style={styles.historyBox}>
            <div style={styles.sectionHeader}>
                <span>⚡ 포지션 (선물)</span>
                {loadingPositions ? (
                    <span style={{fontSize:'0.7rem', color:'var(--trade-subtext)'}}>로딩 중...</span>
                ) : positionError ? (
                    <span style={{fontSize:'0.7rem', color:'red'}}>오류</span>
                ) : (
                    <span style={{fontSize:'0.7rem', color:'var(--trade-subtext)'}}>{positionData.length}건</span>
                )}
            </div>
            <div style={styles.posHeader}>
                <span>코인</span>
                <span>Side</span>
                <span>진입가</span>
                <span>수량</span> 
                <span>미실현</span> 
                <span>실현</span> 
                <span>청산가</span>
            </div>
            <div style={{overflowY:'auto', flex:1}} className="custom-scroll">
                {loadingPositions && (
                    <div style={{textAlign:'center', padding:'20px', color:'var(--trade-subtext)'}}>포지션 데이터를 불러오는 중...</div>
                )}

                {!loadingPositions && positionError && (
                    <div style={{textAlign:'center', padding:'20px', color:'#f23645', wordBreak:'break-all'}}>
                        API 오류: {positionError}
                    </div>
                )}

                {!loadingPositions && !positionError && positionData.length === 0 && (
                    <div style={{textAlign:'center', padding:'20px', color:'var(--trade-subtext)'}}>
                        현재 포지션이 없습니다.
                    </div>
                )}

                {positionData.map((pos, i) => (
                    <div key={i} style={{...styles.tableRow, gridTemplateColumns: '0.7fr 0.6fr 1fr 0.8fr 1fr 1fr 1fr'}}>
                        <div style={styles.coinWrapper}>
                            <img src={coinIcons[pos.coin] || coinIcons.USDT} alt="" style={styles.coinIcon} />
                            <span>{pos.coin}</span>
                        </div>
                        <div><span style={pos.type === '매수' ? styles.badgeLong : styles.badgeShort}>{pos.type}</span></div>
                        <span style={{color:'var(--trade-subtext)'}}>$ {pos.entry}</span>
                        <span style={{color:'var(--trade-text)'}}>{pos.amount}</span>
                        <span style={pos.isWin ? styles.pnlWin : styles.pnlLose}>{pos.pnl}</span>
                        <span style={pos.isRealizedWin ? styles.pnlWin : styles.pnlLose}>{pos.realizedPnl}</span> 
                        <span style={{color:'var(--trade-subtext)'}}>$ {pos.liquidationPrice}</span> 
                    </div>
                ))}
            </div>
        </div>
    );

    // [2] 현물 보유코인
    const renderHoldingTable = () => (
        <div style={styles.historyBox}>
            <div style={styles.sectionHeader}>
                <span>💰 보유 코인 (현물)</span>
                <span style={{fontSize:'0.7rem', color:'var(--trade-subtext)'}}>{holdingData.length}건</span>
            </div>
            <div style={styles.holdHeader}>
                <span>코인</span>
                <span>수량</span>
                <span>평가금</span>
            </div>
            <div style={{overflowY:'auto', flex:1}} className="custom-scroll">
                {holdingData.map((hold, i) => (
                    <div key={i} style={{...styles.tableRow, gridTemplateColumns: '0.9fr 0.9fr 1.2fr'}}>
                        <div style={styles.coinWrapper}>
                            <img src={coinIcons[hold.coin]} alt="" style={styles.coinIcon} />
                            <span>{hold.coin}</span>
                        </div>
                        <span style={{color:'var(--trade-text)'}}>{hold.amount}</span>
                        <div className='won'
                        style={
                            {
                                
                                fontWeight:'bold',
                                display:'flex',
                                flexDirection:'row',
                                justifyContent:'space-between',
                                paddingRight:'30px',
                                paddingLeft:'30px'       
                            }
                            }>

                            <div>{Number(hold.value).toLocaleString()}</div>
                            <div>{'\u20A9'}</div>                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // [3] 거래 내역 (★ 구분 컬럼 추가됨)
    const renderHistoryTable = () => (
        <div style={styles.historyBox}>
            <div style={styles.sectionHeader}>
                <span>📋 거래 내역</span>
                <span style={{fontSize:'0.7rem', color:'var(--trade-subtext)'}}>{historyData.length}건</span>
            </div>
            <div style={styles.histHeader}>
                <span>시간</span>
                <span>코인</span>
                <span>마켓</span>
                <span>구분</span> {/* 추가됨 */}
                <span>종류</span>
                <span>수량</span>
            </div>
            <div style={{overflowY:'auto', flex:1}} className="custom-scroll">
                {historyData.map((trade, i) => (
                    <div key={i} style={{...styles.tableRow, gridTemplateColumns: '0.7fr 0.8fr 0.6fr 0.6fr 0.6fr 0.8fr'}}>
                        <span style={{color:'var(--trade-subtext)'}}>{trade.time}</span>
                        <div style={styles.coinWrapper}>
                            <img src={coinIcons[trade.coin]} alt="" style={styles.coinIcon} />
                            <span>{trade.coin}</span>
                        </div>
                        <span style={{color:'var(--trade-subtext)'}}>{trade.market}</span>
                        
                        {/* ★ 구분 컬럼 (현물/선물) */}
                        <div>
                            <span style={trade.category === '선물' ? styles.badgeFuture : styles.badgeSpot}>
                                {trade.category}
                            </span>
                        </div>
                        
                        <div>
                            <span style={trade.type == "hold" ? styles.badgeLong : styles.badgeShort}>{trade.type}</span>
                        </div>
                        <span style={{color:'var(--trade-subtext)'}}>{trade.qty}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* 좌측: 청산 현황 */}
            <div style={styles.cardsArea}>
                {statsData.map((stat, idx) => (
                    <div key={idx} style={styles.card}>
                        <div style={styles.title}>⚡ {stat.label}</div>
                        <div style={styles.row_long}>
                            <span style={{color:'var(--trade-subtext)'}}>롱 청산</span>
                            <span style={styles.longText}>${stat.long}</span>
                        </div>
                        <div style={styles.row_short}>
                            <span style={{color:'var(--trade-subtext)'}}>숏 청산</span>
                            <span style={styles.shortText}>${stat.short}</span>
                        </div>
                        <div style={styles.row_total}>
                            <span>총 청산</span>
                        </div>
                        <div style={{textAlign:'center'}}>
                            <span style={styles.totalText}>${stat.total}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 우측: 포지션 - 보유코인 - 거래내역 */}
            <div style={styles.rightArea}>
                {isLogin ? (
                    <>
                        {renderPositionTable()}
                        {renderHoldingTable()}
                        {renderHistoryTable()}
                    </>
                ) : (
                    <div style={{...styles.historyBox, alignItems:'center', justifyContent:'center'}}>
                        <h3 style={{margin:'0 0 5px 0', fontSize:'1rem'}}>로그인 후 사용하실 수 있습니다</h3>
                        <p style={{margin:0, fontSize:'0.8rem', color:'var(--trade-subtext)'}}>
                            개인정보 (ex 투자성향, 즐겨찾기, 자금 등)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}