import transformUserData from "./transformUserData"
import defaultallData from "./defaultallData"

// userid 대소문자 필히 확인할 것
export default async function BotData() {
    const defaultAllData = defaultallData()
    
    try {

        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const attemp = 5; 

        let res;
        for (let i = 0; i < attemp; i++) {
            try {
                res = await fetch(`${import.meta.env.VITE_GET_URL}/api/wallet`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
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

        // 데이터 분리하기
        const walletData = transformUserData(data)

        return walletData

    } catch (err) {
        console.error("데이터 가져오기 실패, 기본값 반환:", err);
        return {walletData, analzeData };
    }
}