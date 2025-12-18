import transformUserData from "../common/transformUserData.jsx"
import defaultallData from "../common/defaultallData.jsx"

export default async function UserData() {
    const defaultAllData = defaultallData()
    
    try {

        // await clearStore(min, 1) // 개발환경

        // indexedb 데이터 불러오기
        const cachedData = await loadUpdate("trade", 1);

        // indexedb 데이터가 존재하면 time 불러오기
        let latest_time = "0"; // 기본값
        if(cachedData?.time) {
            latest_time = cachedData.time;
        }
        let ex_data = []
        if(cachedData?.data) {
            ex_data = cachedData.data
        }
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const attemp = 5;  // 최대 재시도 횟수

        let res;
        for (let i = 0; i < attemp; i++) {
            try {
                res = await fetch(`${import.meta.env.VITE_GET_URL}/api/wallet`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        latest_time: latest_time,
                        timezone: userTimezone
                    }),
                    credentials: 'include',
                });

                if (res.ok) break;
            } catch (err) {
                console.warn(`Fetch attempt ${i + 1} failed:`, err);
            }

            await new Promise(r => setTimeout(r, 500));  // 0.5초 대기
        }

        let data = null
        // 최대 시도 후에도 실패하면 기본값 반환
        if (!res || !res.ok) {
            data = defaultAllData ;
        }
        else {
            data = await res.json(); 
        }

        // 기존 데이터 합치기
        let sum_data = []
        // 수신 데이타가 Nodata 일경우 기존 캐시 data 또는 디폴트 데이타 사용
        if (data.data === "Nodata"){
            if(Object.keys(ex_data).length > 0) {
            sum_data = ex_data
            }
        }
        else {
            sum_data = data_sum(ex_data, data.data);
            await saveUpdate("trade", 1, { "time": data.time, "data": sum_data });
        }

        // 데이터 분리하기
        const {chartData, walletData, analzeData} = transformUserData(sum_data)

        return { chartData, walletData, analzeData };

    } catch (err) {
        console.error("데이터 가져오기 실패, 기본값 반환:", err);
        return { chartData, walletData, analzeData };
    }
}