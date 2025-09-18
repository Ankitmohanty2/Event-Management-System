from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from deps import require_admin
from cloudinary_config import upload_image

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/image")
async def upload_event_image(
    file: UploadFile = File(...),
    _admin = Depends(require_admin),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    try:
        content = await file.read()
        image_url = upload_image(content, f"event_{file.filename}")
        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
