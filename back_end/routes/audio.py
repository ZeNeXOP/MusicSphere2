from flask import Blueprint, jsonify, request
from database import mongo
from flask import current_app
import cloudinary
import cloudinary.uploader
import os
from datetime import datetime
from dotenv import load_dotenv
from models import UserHistory, Music
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

audio_bp = Blueprint("audio", __name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Debug: Log Cloudinary configuration status
cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
api_key = os.getenv('CLOUDINARY_API_KEY')
api_secret = os.getenv('CLOUDINARY_API_SECRET')

print(f"🔧 Cloudinary Config - Cloud Name: {cloud_name}")
api_key_display = f"{api_key[:10]}..." if api_key else "None"
print(f"🔧 Cloudinary Config - API Key: {api_key_display}")
secret_status = "Set" if api_secret else "Not Set"
print(f"🔧 Cloudinary Config - API Secret: {secret_status}")


@audio_bp.route("/music", methods=["GET"])
def get_music():
    try:
        music_files = list(mongo.db.music.find({}))
        for doc in music_files:
            doc['_id'] = str(doc['_id'])
            doc['url'] = doc.get('cloudinary_url', '')
            doc['artist'] = doc.get('artist', 'Unknown Artist')
            doc['cover_url'] = doc.get('cover_url', None)
        return jsonify(music_files)
    except Exception as e:
        current_app.logger.error("Database error: %s", str(e))
        return jsonify({"error": str(e)}), 500


@audio_bp.route("/music/<song_id>", methods=["GET"])
def get_song_by_id(song_id):
    """Get individual song details by ID."""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(song_id):
            return jsonify({"error": "Invalid song ID format"}), 400
            
        song = mongo.db.music.find_one({"_id": ObjectId(song_id)})
        
        if not song:
            return jsonify({"error": "Song not found"}), 404
            
        # Format the response
        song['_id'] = str(song['_id'])
        song['url'] = song.get('cloudinary_url', '')
        song['artist'] = song.get('artist', 'Unknown Artist')
        song['title'] = song.get('title', 'Unknown Title')
        song['album'] = song.get('album', '')
        song['genre'] = song.get('genre', '')
        song['description'] = song.get('description', '')
        song['cover_url'] = song.get('cover_url', None)
        song['duration'] = song.get('duration', 0)
        song['created_at'] = song.get('created_at', '')
        song['uploaded_by'] = song.get('uploaded_by', 'Anonymous')
        song['play_count'] = song.get('play_count', 0)
        song['likes'] = song.get('likes', 0)
        
        current_app.logger.info(f"🎵 Retrieved song: {song.get('title')} by {song.get('artist')}")
        
        return jsonify(song), 200
        
    except Exception as e:
        current_app.logger.error(f"💥 Error fetching song: {str(e)}")
        return jsonify({"error": f"Failed to fetch song: {str(e)}"}), 500


@audio_bp.route("/upload", methods=["POST"])
def upload_audio():
    try:
        current_app.logger.info("🚀 Upload request received")
        current_app.logger.info(
            f"📂 Files in request: {list(request.files.keys())}"
        )
        current_app.logger.info(f"📝 Form data: {dict(request.form)}")
        
        # Debug: Check Cloudinary configuration
        config = cloudinary.config()
        current_app.logger.info(f"☁️ Cloudinary cloud_name: {config.cloud_name}")
        api_key_log = f"{config.api_key[:10]}..." if config.api_key else "None"
        current_app.logger.info(f"☁️ Cloudinary api_key: {api_key_log}")
       
        # Check if file is present
        if 'audio' not in request.files:
            current_app.logger.error("❌ No audio file in request")
            return jsonify({"error": "No audio file provided"}), 400
       
        file = request.files['audio']
        cover_file = request.files.get('cover')  # Optional cover image
        
        current_app.logger.info(
            f"📁 File received: {file.filename}, "
            f"size: {file.content_length}"
        )
        
        if cover_file:
            current_app.logger.info(
                f"🖼️ Cover image received: {cover_file.filename}, "
                f"size: {cover_file.content_length}"
            )
        
        if file.filename == '':
            current_app.logger.error("❌ Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Get form data
        title = request.form.get('title', '').strip()
        artist = request.form.get('artist', '').strip()
        album = request.form.get('album', '').strip()
        genre = request.form.get('genre', '').strip()
        description = request.form.get('description', '').strip()
        
        current_app.logger.info(
            f"📋 Parsed form data - Title: {title}, Artist: {artist}, "
            f"Album: {album}, Genre: {genre}"
        )
        
        # Validate required fields
        if not title or not artist:
            current_app.logger.error("❌ Missing required fields")
            return jsonify({"error": "Title and artist are required"}), 400
        
        # Check file type
        allowed_extensions = {'.mp3', '.wav', '.flac', '.m4a', '.aac'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        current_app.logger.info(f"🔍 File extension: {file_ext}")
        
        if file_ext not in allowed_extensions:
            error_msg = (
                f"Unsupported file type. "
                f"Allowed: {', '.join(allowed_extensions)}"
            )
            current_app.logger.error(f"❌ {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        # Upload to Cloudinary
        current_app.logger.info(
            f"☁️ Starting Cloudinary upload for {file.filename}..."
        )
        
        result = cloudinary.uploader.upload(
            file,
            resource_type="video",  # Use video for audio streaming
            folder="music_sphere",
            transformation=[{"format": "mp3", "audio_codec": "mp3"}],
            use_filename=True,
            unique_filename=False
        )
        
        current_app.logger.info(
            f"✅ Cloudinary upload successful: {result.get('secure_url')}"
        )
        current_app.logger.info(
            f"📊 Cloudinary result: Duration={result.get('duration')}, "
            f"Size={result.get('bytes')}, Format={result.get('format')}"
        )
        
        cloudinary_url = result["secure_url"]
        duration = result.get("duration", 0)  # Duration in seconds
        
        # Upload cover image if provided
        cover_url = None
        if cover_file and cover_file.filename:
            current_app.logger.info(f"🖼️ Starting cover image upload...")
            
            # Validate cover image file type
            allowed_image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
            cover_ext = os.path.splitext(cover_file.filename)[1].lower()
            
            if cover_ext not in allowed_image_extensions:
                current_app.logger.warning(f"⚠️ Invalid cover image type: {cover_ext}")
            else:
                try:
                    cover_result = cloudinary.uploader.upload(
                        cover_file,
                        resource_type="image",
                        folder="music_sphere/covers",
                        transformation=[
                            {"width": 500, "height": 500, "crop": "fill"},
                            {"quality": "auto"}
                        ],
                        use_filename=True,
                        unique_filename=False
                    )
                    cover_url = cover_result["secure_url"]
                    current_app.logger.info(f"✅ Cover image upload successful: {cover_url}")
                except Exception as cover_error:
                    current_app.logger.error(f"⚠️ Cover upload failed: {str(cover_error)}")
                    # Continue without cover image - don't fail the whole upload
        
        # Create music entry with all properties
        music_entry = {
            "title": title,
            "artist": artist,
            "album": album if album else None,
            "genre": genre if genre else None,
            "description": description if description else None,
            "cloudinary_url": cloudinary_url,
            "duration": duration,
            "file_size": result.get("bytes", 0),
            "format": result.get("format", "mp3"),
            "uploaded_by": request.form.get('uploaded_by', 'Anonymous'),
            "created_at": datetime.utcnow().isoformat(),
            "cover_url": cover_url,
            "play_count": 0,
            "likes": 0,
            "public": request.form.get('public', 'true').lower() == 'true'
        }
        
        current_app.logger.info(f"💾 Inserting to MongoDB: {music_entry}")
        
        # Insert into MongoDB
        result_db = mongo.db.music.insert_one(music_entry)
        music_entry['_id'] = str(result_db.inserted_id)
        
        current_app.logger.info(
            f"✅ MongoDB insert successful: ID={result_db.inserted_id}"
        )
        
        response_data = {
            "message": "Song uploaded successfully",
            "song": {
                "id": str(result_db.inserted_id),
                "title": title,
                "artist": artist,
                "album": album,
                "genre": genre,
                "url": cloudinary_url,
                "duration": duration
            }
        }
        
        current_app.logger.info(f"🎉 Upload complete: {title} by {artist}")
        return jsonify(response_data), 201
        
    except Exception as e:
        current_app.logger.error(f"💥 Upload error: {str(e)}")
        current_app.logger.error(f"💥 Error type: {type(e).__name__}")
        import traceback
        current_app.logger.error(f"💥 Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500


@audio_bp.route("/history/record", methods=["POST"])
@jwt_required()
def record_play():
    """Record a song play in user history."""
    try:
        username = get_jwt_identity()
        data = request.get_json()
        
        if not data or not all(k in data for k in ["song_id", "duration_played"]):
            return jsonify({"error": "Missing required fields"}), 400
            
        history_id = UserHistory.record_play(
            username=username,
            song_id=data["song_id"],
            duration_played=data["duration_played"]
        )
        
        if not history_id:
            return jsonify({"error": "Failed to record play history"}), 500
            
        return jsonify({
            "message": "Play history recorded",
            "history_id": history_id
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error recording play history: {str(e)}")
        return jsonify({"error": str(e)}), 500


@audio_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    """Get user's play history."""
    try:
        username = get_jwt_identity()
        limit = int(request.args.get("limit", 50))
        
        history = UserHistory.get_user_history(username, limit)
        return jsonify(history)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching play history: {str(e)}")
        return jsonify({"error": str(e)}), 500


@audio_bp.route("/history/recent", methods=["GET"])
@jwt_required()
def get_recent_plays():
    """Get user's recently played songs."""
    try:
        username = get_jwt_identity()
        limit = int(request.args.get("limit", 10))
        
        recent = UserHistory.get_recently_played(username, limit)
        return jsonify(recent)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching recent plays: {str(e)}")
        return jsonify({"error": str(e)}), 500


@audio_bp.route("/history/most-played", methods=["GET"])
@jwt_required()
def get_most_played():
    """Get user's most played songs."""
    try:
        username = get_jwt_identity()
        limit = int(request.args.get("limit", 10))
        
        most_played = UserHistory.get_most_played(username, limit)
        return jsonify(most_played)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching most played: {str(e)}")
        return jsonify({"error": str(e)}), 500


@audio_bp.route("/search", methods=["GET"])
def search_music():
    """Search for music by title, artist, album, or genre."""
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400
            
        if len(query) < 1:
            return jsonify({"error": "Search query must be at least 1 character"}), 400
            
        # Use the Music model's search method
        results = Music.search_music(query)
        
        # Convert ObjectId to string and ensure proper formatting
        for doc in results:
            doc['_id'] = str(doc['_id'])
            doc['url'] = doc.get('cloudinary_url', '')
            doc['artist'] = doc.get('artist', 'Unknown Artist')
            doc['title'] = doc.get('title', 'Unknown Title')
            doc['album'] = doc.get('album', '')
            doc['genre'] = doc.get('genre', '')
            doc['duration'] = doc.get('duration', 0)
            doc['cover_url'] = doc.get('cover_url', None)
            
        current_app.logger.info(f"🔍 Search for '{query}' returned {len(results)} results")
        
        return jsonify({
            "query": query,
            "results": results,
            "count": len(results)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"💥 Search error: {str(e)}")
        return jsonify({"error": f"Search failed: {str(e)}"}), 500
    