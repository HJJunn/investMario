export default async function LoginTokenSend(AuthorizeCode) {
  try {
    const res = await fetch(`${import.meta.env.VITE_GET_URL}/api/GoogleLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token : AuthorizeCode }),
      credentials: 'include' // 쿠키 포함
    });

    const data = await res.json();
    if (data.message === "signclear")
    {
        alert("회원 가입 성공")
    }
 
    if (data.message === "loginclear")
    {
        alert("로그인 성공")
    }

    console.log("Server Response Data:", data);
    if(!res.ok)
    {
      console.error("HTTP Error:", res.status);
      return false;
    }
    return true;
  } catch(err)
  {
    console.error("Fetch error:", err);
    return false;
  }
}