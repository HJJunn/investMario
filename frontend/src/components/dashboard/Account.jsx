import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import "../../styles/dashboard/Account.css";

import UserData from "../../services/POST/AccountPage_Data.jsx";

export default function Account({min}) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTime, setSearchTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const maxRetries = 5;
      let attempt = 0;
      let finalAllData = [];

      while (attempt < maxRetries) {
        try {
          const { allData, check } = await UserData(min); 
          finalAllData = allData;
          if (!check) {
            attempt++;
            console.warn(`데이터 fetch 실패, 재시도 ${attempt}회`);
            await new Promise(res => setTimeout(res, 1000));
            continue;
          } else {
            setUserData(data_split(allData));
            setLoading(false);
            return;
          }
        } catch (err) {
          attempt++;
          console.error(`데이터 가져오기 실패 (시도 ${attempt}):`, err);
          await new Promise(res => setTimeout(res, 1000));
        }
      }

      console.error("최대 재시도 5회 초과, 기본값으로 세팅");

      setUserData(data_split(finalAllData));
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  const filteredData = (userData.time ?? []).map((t, index) => ({
    time: t,
    reason: {
      BTC: userData.why.btc?.[index] ?? "N/A",
      ETH: userData.why.eth?.[index] ?? "N/A",
      XRP: userData.why.xrp?.[index] ?? "N/A",
      DOGE: userData.why.doge?.[index] ?? "N/A",
      SOL: userData.why.sol?.[index] ?? "N/A",
    },
    position: {
      BTC: userData.position.btc?.[index] ?? "N/A",
      ETH: userData.position.eth?.[index] ?? "N/A",
      XRP: userData.position.xrp?.[index] ?? "N/A",
      DOGE: userData.position.doge?.[index] ?? "N/A",
      SOL: userData.position.sol?.[index] ?? "N/A",
    },
    total: userData.total?.[index] ?? 0,
  })).filter(item => String(item.time).includes(searchTime));

  return (
    <div className="account-container">
      <div className="center-left">
        <div className="account-information">
          <h2>Account Information</h2>
          <div className="infro">
            <p>Name: {userData.username}</p>
            <p>Created: {userData.time?.[0] ?? "0000-00-00 00:00"}</p>
            <p>UserModel: {userData.usemodel?.at(-1) ?? "Unknown"}</p>
            <p>Post: <input type="text" /></p>
            <p>Phone-Number: <input type="text" /></p>
            <p>Current Membership:</p>
            <button>Save</button>
          </div>
        </div>

        <div className="coin-wallet">
          <h2>Account Live</h2>
          <div className="roundchart">
            <RoundChart data={[
              { name: "BIT", value: userData.bit?.at(-1) ?? 0 },
              { name: "ETH", value: userData.eth?.at(-1) ?? 0 },
              { name: "XRP", value: userData.xrp?.at(-1) ?? 0 },
              { name: "DOGE", value: userData.dog?.at(-1) ?? 0 },
              { name: "SOL", value: userData.sol?.at(-1) ?? 0 },
              { name: "CASH", value: userData.non?.at(-1) ?? 0 },
            ]} />
          </div>
        </div>

        <div className="history">
          <input
            className="Search"
            placeholder="YYYY-MM-DD HH:MM"
            type="text"
            value={searchTime}
            onChange={e => setSearchTime(e.target.value)}
          />
          <div className="hitroy-data">
            {filteredData.map((item, index) => (
              <div className="history-card" key={index}>
                <h4>Time: {item.time ?? "Unknown Time"}</h4>
                <p>
                  Reason: BTC({item.reason.BTC}), ETH({item.reason.ETH}), XRP({item.reason.XRP}),
                  DOGE({item.reason.DOGE}), SOL({item.reason.SOL})
                </p>
                <p>
                  Position: BTC({item.position.BTC}), ETH({item.position.ETH}), XRP({item.position.XRP}),
                  DOGE({item.position.DOGE}), SOL({item.position.SOL})
                </p>
                <p>Total: {item.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
