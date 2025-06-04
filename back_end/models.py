from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from database import mongo
import re
from datetime import datetime

class User:
    @staticmethod
    def validate_email(email):
        """Validate email format."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, email))

    @staticmethod
    def validate_password(password):
        """Validate password strength."""
        # At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'[0-9]', password):
            return False, "Password must contain at least one number"
        return True, "Password is valid"

    @staticmethod
    def validate_username(username):
        """Validate username format."""
        # Username should be 3-20 characters, alphanumeric with underscores
        if len(username) < 3 or len(username) > 20:
            return False, "Username must be between 3 and 20 characters"
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "Username can only contain letters, numbers, and underscores"
        return True, "Username is valid"

    @staticmethod
    def create(email, password, username):
        """Create a new user with validation."""
        # Validate email
        if not User.validate_email(email):
            raise ValueError("Invalid email format")

        # Validate password
        is_valid, message = User.validate_password(password)
        if not is_valid:
            raise ValueError(message)

        # Validate username
        is_valid, message = User.validate_username(username)
        if not is_valid:
            raise ValueError(message)

        # Check if email already exists
        if User.find_by_email(email):
            raise ValueError("Email already registered")

        # Create user
        user = {
            "email": email,
            "password": generate_password_hash(password),
            "username": username
        }
        return mongo.db.users.insert_one(user)
    
    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})
    
    @staticmethod
    def check_password(user, password):
        return check_password_hash(user["password"], password)


class Music:
    @staticmethod
    def create_music(title, artist, cloudinary_url, album=None, genre=None, 
                    description=None, duration=0, file_size=0, format="mp3",
                    uploaded_by="Anonymous", created_at=None, cover_url=None, 
                    play_count=0, likes=0, public=True):
        """Insert a new music record into the database with all fields."""
        music = {
            "title": title,
            "artist": artist,
            "cloudinary_url": cloudinary_url,
            "album": album,
            "genre": genre,
            "description": description,
            "duration": duration,
            "file_size": file_size,
            "format": format,
            "uploaded_by": uploaded_by,
            "created_at": created_at,
            "cover_url": cover_url,
            "play_count": play_count,
            "likes": likes,
            "public": public
        }
        return mongo.db.music.insert_one(music).inserted_id

    @staticmethod
    def get_all_music():
        """Retrieve all music records with all fields."""
        return list(mongo.db.music.find({}))

    @staticmethod
    def get_music_by_id(music_id):
        """Retrieve a single music record by its ID."""
        return mongo.db.music.find_one({"_id": music_id})

    @staticmethod
    def delete_music(music_id):
        """Delete a music record by its ID."""
        return mongo.db.music.delete_one({"_id": music_id})

    @staticmethod
    def update_music(music_id, **kwargs):
        """Update a music record with any provided fields."""
        update_fields = {}
        allowed_fields = [
            "title", "artist", "album", "genre", "description", 
            "cloudinary_url", "duration", "file_size", "format",
            "uploaded_by", "cover_url", "play_count", "likes", "public"
        ]
        
        for field, value in kwargs.items():
            if field in allowed_fields and value is not None:
                update_fields[field] = value
                
        if update_fields:
            return mongo.db.music.update_one({"_id": music_id}, {"$set": update_fields})
        return None

    @staticmethod
    def get_public_music():
        """Retrieve only public music records."""
        return list(mongo.db.music.find({"public": True}))

    @staticmethod
    def search_music(query):
        """Search music by title, artist, album, or genre."""
        search_pattern = {"$regex": query, "$options": "i"}
        return list(mongo.db.music.find({
            "$or": [
                {"title": search_pattern},
                {"artist": search_pattern},
                {"album": search_pattern},
                {"genre": search_pattern}
            ]
        }))


class UserHistory:
    @staticmethod
    def record_play(username, song_id, duration_played):
        """Record a song play in user history."""
        try:
            # Get song details
            song = mongo.db.music.find_one({"_id": ObjectId(song_id)})
            if not song:
                raise ValueError("Song not found")

            history_entry = {
                "username": username,
                "song_id": ObjectId(song_id),
                "song_title": song.get("title", "Unknown"),
                "artist": song.get("artist", "Unknown"),
                "duration_played": duration_played,  # in seconds
                "played_at": datetime.utcnow(),
                "completed": duration_played >= (song.get("duration", 0) * 0.9)  # Consider it complete if 90% played
            }
            
            result = mongo.db.user_history.insert_one(history_entry)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error recording play history: {str(e)}")
            return None

    @staticmethod
    def get_user_history(username, limit=50):
        """Get user's play history."""
        try:
            history = list(mongo.db.user_history.find(
                {"username": username},
                {"_id": 1, "song_title": 1, "artist": 1, 
                 "duration_played": 1, "played_at": 1, "completed": 1}
            ).sort("played_at", -1).limit(limit))
            
            # Convert ObjectId to string for JSON serialization
            for entry in history:
                entry["_id"] = str(entry["_id"])
            
            return history
        except Exception as e:
            print(f"Error fetching play history: {str(e)}")
            return []

    @staticmethod
    def get_recently_played(username, limit=10):
        """Get user's recently played unique songs."""
        try:
            # Get unique songs by taking the last play of each song
            pipeline = [
                {"$match": {"username": username}},
                {"$sort": {"played_at": -1}},
                {"$group": {
                    "_id": "$song_id",
                    "last_played": {"$first": "$played_at"},
                    "song_title": {"$first": "$song_title"},
                    "artist": {"$first": "$artist"},
                    "play_count": {"$sum": 1}
                }},
                {"$sort": {"last_played": -1}},
                {"$limit": limit}
            ]
            
            recent = list(mongo.db.user_history.aggregate(pipeline))
            
            # Convert ObjectId to string
            for entry in recent:
                entry["song_id"] = str(entry["_id"])
                entry["_id"] = str(entry["_id"])
            
            return recent
        except Exception as e:
            print(f"Error fetching recent plays: {str(e)}")
            return []

    @staticmethod
    def get_most_played(username, limit=10):
        """Get user's most played songs."""
        try:
            pipeline = [
                {"$match": {"username": username}},
                {"$group": {
                    "_id": "$song_id",
                    "song_title": {"$first": "$song_title"},
                    "artist": {"$first": "$artist"},
                    "play_count": {"$sum": 1},
                    "last_played": {"$max": "$played_at"},
                    "total_duration": {"$sum": "$duration_played"}
                }},
                {"$sort": {"play_count": -1}},
                {"$limit": limit}
            ]
            
            most_played = list(mongo.db.user_history.aggregate(pipeline))
            
            # Convert ObjectId to string
            for entry in most_played:
                entry["song_id"] = str(entry["_id"])
                entry["_id"] = str(entry["_id"])
            
            return most_played
        except Exception as e:
            print(f"Error fetching most played: {str(e)}")
            return []
