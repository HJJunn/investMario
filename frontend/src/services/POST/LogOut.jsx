export default async function LogOut() {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(`${import.meta.env.VITE_GET_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return true; // 성공 시 true 반환
        } catch (err) {
            console.error(`로그아웃 실패 (시도 ${attempt}):`, err);
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기 후 재시도
            } else {
                return false; // 마지막 시도까지 실패하면 false 반환
            }
        }
    }
}