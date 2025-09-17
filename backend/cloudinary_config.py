import os
import cloudinary
import cloudinary.uploader

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if not (CLOUD_NAME and API_KEY and API_SECRET):
    raise RuntimeError(
        "Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    )

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True,
)


def upload_image(file_content, public_id=None):
    """Upload image to Cloudinary and return URL"""
    result = cloudinary.uploader.upload(
        file_content,
        public_id=public_id,
        folder="event-management",
        resource_type="image",
    )
    return result["secure_url"]
