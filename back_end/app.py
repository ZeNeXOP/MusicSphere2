from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database import mongo
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()


def create_app():
    app = Flask(__name__)

    # Security configurations
    app.config['MONGO_URI'] = os.getenv(
        'MONGO_URI',
        "mongodb://localhost:27017/MusicSphere"
    )
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY',
        os.urandom(24).hex()
    )
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production
    app.config['JWT_COOKIE_HTTPONLY'] = True
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'  # Changed from 'Strict' for development
    app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # For development only

    # Initialize extensions
    mongo.init_app(app)
    JWTManager(app)

    # CORS configuration
    CORS(app, 
         resources={r"/api/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "expose_headers": ["Content-Type", "Authorization"]
         }},
         supports_credentials=True)

    # Error handling middleware
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error('Server Error: %s', error)
        return jsonify({'error': 'Internal server error'}), 500

    @app.after_request
    def after_request(response):
        # Add security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = (
            'max-age=31536000; includeSubDomains'
        )
        return response

    # Register blueprints
    from routes.auth import auth_bp
    from routes.audio import audio_bp   
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(audio_bp, url_prefix="/api/audio")

    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true',
        port=int(os.getenv('PORT', 5000)),
        host=os.getenv('HOST', 'localhost')
    )
