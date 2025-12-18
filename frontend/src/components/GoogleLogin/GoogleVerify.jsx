export default async function useGoogleVerify() {
  
  try {
    const res = await fetch(`${import.meta.env.VITE_POST_URL}/api/verifyjwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();

    let result  = "";
    let username  = "";

    if (data.message === "verified") {
      result = data.message;
      username = data.username;
      return {result, username};

    } else if (data.message === "expired") {
      result = data.message;
      username = "";      
      return {result, username};
      
    } else if (data.message === "noexist") {
      result = data.message;
      username = "";            
      return {result, username};
    }
    
  } catch (err) {
    console.error("JWT verification failed:", err);
    return false;
  }
}
