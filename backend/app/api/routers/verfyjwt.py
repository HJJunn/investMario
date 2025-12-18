from app.common.imports import *
from app.services.jwt_service import TokenJwt

router = APIRouter()

# verify jwt => token refresh
@router.post("/verifyjwt")
async def verify_jwt(request: Request):
    token = request.cookies.get("jwt")
    
    if not token:
        return JSONResponse(
            status_code=401,
            content={"status": "error", "message": "noexist", "username" : ""}
        )

    jwt_service = TokenJwt(token=token)
    
    new_token = jwt_service.refresh_token()
    payload = TokenJwt(token=new_token).decode_token()

    if not new_token:

        return JSONResponse(
            status_code=401,
            content={"status": "expired", "message": "expired", "username" : ""}
        )
    
    response = JSONResponse(
        status_code=200,
        content={"status": "success", "message": "verified", "username" : payload['name']}
    )
    response.set_cookie(key="jwt", value=new_token, httponly=True)
    return response
