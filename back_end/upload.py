import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from database import mongo
from app import app

# Load environment variables
load_dotenv()

with app.app_context():
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

    folder_path = os.path.abspath("uploads")

    # Upload all audio files from a folder
    def upload_music_and_save(folder_path):
        # Process each file in the folder
        # Initialize list to store uploaded files
        uploaded_files = []

        for filename in os.listdir(folder_path):
            if filename.endswith((".mp3", ".wav", ".flac")):
                file_path = os.path.join(folder_path, filename)
                app.logger.info(f"Uploading {filename}...")

                result = cloudinary.uploader.upload(
                    file_path,
                    resource_type="video",
                    folder="music_sphere",
                    transformation=[{"format": "mp3", "audio_codec": "mp3"}],
                    use_filename=True,
                    unique_filename=False
                )
                cloudinary_url = result["secure_url"]
                # Extract artist from filename or set a placeholder
                artist = filename.split('-')[0] if '-' in filename else "Unknown Artist"
                music_entry = {
                    "title": filename,
                    "artist": artist,
                    "cloudinary_url": cloudinary_url
                }
                mongo.db.music.insert_one(music_entry)
            
                uploaded_files.append({
                    "file_name": filename,
                    "file_url": result["secure_url"]
                })
                app.logger.info(f"Uploaded: {cloudinary_url}")

        return uploaded_files

    # Example usage
    if __name__ == "__main__":
        uploaded_files = upload_music_and_save(folder_path)
        app.logger.info("\nAll Uploaded Files: %s", uploaded_files)
