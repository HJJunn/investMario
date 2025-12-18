import { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import '../../styles/trade/BinanceChart.css'



// --- 코인 및 인터벌 설정 ---
const intervals = [
  "1m", "3m", "5m", "15m", "30m",
  "1h", "2h", "4h", "6h", "8h", "12h",
  "1d", "3d", "1w", "1M"
];

const coinLogoMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binance-coin",
  USDT: "tether",
  ADA: "cardano",
  XRP: "ripple",
  SOL: "solana",
  DOGE: "dogecoin",
  MATIC: "matic-network",
  DOT: "polkadot",
  LTC: "litecoin",
  LINK: "chainlink",
  UNI: "uniswap",
  BCH: "bitcoin-cash",
  XLM: "stellar",
  VET: "vechain",
  THETA: "theta",
  FIL: "filecoin",
  TRX: "tron",
  EOS: "eos",
  AAVE: "aave",
  AVAX: "avalanche",
  SHIB: "shiba-inu",
  ALGO: "algorand",
  ICP: "internet-computer",
  CRO: "crypto-com",
  ATOM: "cosmos",
  NEAR: "near",
  KSM: "kusama",
  FTT: "ftx-token",
  SAND: "the-sandbox",
  MANA: "decentraland",
  CHZ: "chiliz",
  XMR: "monero",
  ZEC: "zcash",
};

// 추후 여기서 user 정보 불러와서 확인 할 것
function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <button
      className="bookBtn"
      onClick={() => setIsBookmarked(!isBookmarked)}
    >
      {isBookmarked ? (
        <i className="fa-solid fa-star"></i>
      ) : (
        <i className="fa-regular fa-star"></i>
      )}
    </button>
  );
}

// --- OrderBook 컴포넌트 ---
function OrderBook({ symbol }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    async function fetchOrderBook() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${symbol}USDT&limit=7`
        );
        const data = await res.json();
        setBids(data.bids);
        setAsks(data.asks);
      } catch (err) {
        console.error("OrderBook fetch error:", err);
      }
    }

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="order-book-inner-vertical">
      {/* Asks: 위쪽 */}
      <div className="order-book-asks">
        <h4>Asks</h4>
        {asks.slice().reverse().map(([price, qty], i) => (
          <div key={i} className="order-row ask">
            <span className="price">{parseFloat(price).toFixed(2)}</span>
            <span className="qty">{parseFloat(qty).toFixed(5)}</span>
          </div>
        ))}
      </div>

      {/* Bids: 아래쪽 */}
      <div className="order-book-bids">
        <h4>Bids</h4>
        {bids.map(([price, qty], i) => (
          <div key={i} className="order-row bid">
            <span className="price">{parseFloat(price).toFixed(2)}</span>
            <span className="qty">{parseFloat(qty).toFixed(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 메인 차트 컴포넌트 ---
export default function FapiMultiCoinChart() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [displayData, setDisplayData] = useState([]);
  const allDataRef = useRef({});
  const wsRef = useRef(null);
  const [chartType, setChartType] = useState("candlestick");
  const [searchTicker, setSearchTicker] = useState("");
  const [allSymbols, setAllSymbols] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [invalidTicker, setInvalidTicker] = useState(false);

  // --- 전체 심볼 불러오기 ---
  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then(res => res.json())
      .then(data => setAllSymbols(data.symbols.map(s => s.symbol.replace("USDT", ""))));
  }, []);

  // --- 입력값 변경 시 추천 ---
  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setSearchTicker(val);
    if (val.length > 0) {
      const matches = allSymbols.filter(s => s.startsWith(val)).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
    setInvalidTicker(false);
  };

  const handleTickerEnter = () => {
    if (!searchTicker.trim()) return;
    const symbol = searchTicker.trim().toUpperCase();
    if (allSymbols.includes(symbol)) {
      setSelectedCoin(symbol);
      setSearchTicker("");
      setSuggestions([]);
      setInvalidTicker(false);
    } else {
      setInvalidTicker(true);
    }
  };

  // 1. 초기 데이터 & interval 변경시
  useEffect(() => {
    async function fetchData() {
      const candles = [];
      const res = await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${selectedCoin}USDT&interval=${selectedInterval}&limit=60`
      );
      const data = await res.json();

      data.forEach((d) => {
        candles.push({
          x: new Date(d[0]),
          y: chartType === "candlestick"
            ? [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])]
            : parseFloat(d[4])
        });
      });

      allDataRef.current[selectedCoin] = candles;
      setDisplayData([...candles]);
    }

    fetchData();
  }, [selectedCoin, selectedInterval, chartType]);

  // 2. WebSocket 실시간 업데이트
  useEffect(() => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedCoin.toLowerCase()}usdt@kline_${selectedInterval}`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const k = message.k;

      const candle = {
        x: new Date(k.t),
        y: chartType === "candlestick"
          ? [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)]
          : parseFloat(k.c)
      };

      const series = allDataRef.current[selectedCoin] || [];
      const last = series[series.length - 1];

      if (last && last.x.getTime() === candle.x.getTime()) {
        series[series.length - 1] = candle;
      } else {
        series.push(candle);
        allDataRef.current[selectedCoin] = series.slice(-60);
      }

      setDisplayData([...allDataRef.current[selectedCoin]]);
    };

    return () => ws.close();
  }, [selectedCoin, selectedInterval, chartType]);

  // 3. 차트 옵션
  const candleOptions = {
    chart: {
      id: "candles",
      type: chartType,
      animations: { enabled: true },
      toolbar: { show: false },
      zoom: { enabled: false, type: 'x', autoScaleYaxis: false }
    },
    xaxis: {
      type: "datetime",
      tickAmount : 15,
      labels: {
        style: { colors: "var(--text-color)", fontSize: "0.6em" },
        formatter: (val) => {
          const date = new Date(val);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
        },
      },
    },
    yaxis: {
      opposite: true,
      tickAmount: 6,
      forceNiceScale: true,
      tooltip: { enabled: true },
      labels: {
        show: true,        // ← y축 라벨 보이게 하기
        position: "right", // ← y축 라벨을 오른쪽에 배치
        style: { 
          colors: "var(--text-color)",
          fontSize:"0.7em"
        }
      }
    },
    tooltip: { shared: true },
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" }
      }
    },
      responsive: [
      {
        breakpoint: 768,
        options: {
          xaxis: { tickAmount: 4 },
          yaxis: {
            labels: {
              show:false
            }
          }
        }
      }
    ]
  };

  return (
    <div className="chart-container" style={{ display: 'block', padding: 0 }}>
      <div className="chart">
        <div className="chart-Ticker">
          <img
            src={`https://cdn.jsdelivr.net/gh/simplr-sh/coin-logos/images/${coinLogoMap[selectedCoin] || 'default-coin'}/small.png`}
            alt={selectedCoin}
            onError={(e) => { e.currentTarget.src = "/assets/default-coin.png"; }}
          />
          <h2>
            {selectedCoin} | Price:{" "}
            {displayData.length > 0
              ? chartType === "candlestick"
                ? displayData[displayData.length - 1].y[3].toFixed(2)
                : displayData[displayData.length - 1].y.toFixed(2)
              : "loading..."} USD
          </h2>

          <BookmarkButton />
        </div>

        <div className="chart-button-container">
          <div className="chart-header-select">
            {intervals.map((intv) => (
              <button
                key={intv}
                onClick={() => setSelectedInterval(intv)}
                className="coin-button"
              >
                {intv}
              </button>
            ))}
          </div>
        </div>

        <Chart
          options={candleOptions}
          series={[{ name: selectedCoin, data: displayData }]}
          type={chartType}
          className="coin-candle-chart"
          height={550} // 높이를 고정하거나 부모에 맞춤
        />
      </div>
    </div>
  );
}
