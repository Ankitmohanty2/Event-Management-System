import cloudinary
import cloudinary.uploader
import os

# Configure Cloudinary
cloudinary.config(
    cloud_name="dkrvio7wf",
    api_key="6DtlNvDGjO73GXKl8Bv8pROERvE",
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "your_api_secret_here")
)

def upload_image(file_content, public_id=None):
    """Upload image to Cloudinary and return URL"""
    try:
        result = cloudinary.uploader.upload(
            file_content,
            public_id=public_id,
            folder="event-management",
            resource_type="image"
        )
        return result["secure_url"]
    except Exception as e:
        raise Exception(f"Failed to upload image: {str(e)}")
