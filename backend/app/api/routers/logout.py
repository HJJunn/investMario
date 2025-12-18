from app.common.imports import *

router = APIRouter()

@router.post("/logout")
async def logout(request: Request, response: Response):
    
    response.delete_cookie(key="jwt", path="/")
    
    return {"message": "LoggedOut"}
