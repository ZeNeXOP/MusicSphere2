from flask import Blueprint, request, jsonify
from models import User
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request
)
from flask import current_app


# Ensure two blank lines before first route


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not all([email, password, username]):
            return jsonify({
                "error": "Email, username, and password are required"
            }), 400

        if User.find_by_email(email):
            return jsonify({
                "error": "Email already exists"
            }), 400

        try:
            # Create the user. We don't need the returned insert result.
            _ = User.create(email, password, username)

            # Create tokens
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            
            response = jsonify(
                {
                    "message": "User registered successfully",
                    "user": {"email": email, "username": username},
                }
            )
            
            # Set tokens in cookies
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            
            return response, 201
            
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
            
    except Exception as e:
        current_app.logger.error("Registration error: %s", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "error": "Email and password are required"
            }), 400

        user = User.find_by_email(email)

        if not user or not User.check_password(user, password):
            return jsonify({
                "error": "Invalid credentials"
            }), 401

        # Create tokens
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)

        response = jsonify(
            {
        "message": "Login successful",
        "user": {
            "email": user["email"],
                    "username": user["username"],
                },
            }
        )
        
        # Set tokens in cookies
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        return response
        
    except Exception as e:
        current_app.logger.error("Login error: %s", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logged out successfully"})
    unset_jwt_cookies(response)
    return response


@auth_bp.route("/check", methods=["GET"])
def check_auth():
    """Return authentication status.

    We verify JWT if present but don't require it, so missing/invalid tokens
    result in a graceful `authenticated: false` response instead of HTTP 401.
    """
    try:
        # Validate JWT if present, but don't require it.
        verify_jwt_in_request(optional=True)
        current_user = get_jwt_identity()

        user = None
        if current_user:
            user = User.find_by_email(current_user)

        if user:
            return (
                jsonify(
                    {
                        "authenticated": True,
                        "user": {
                            "email": user["email"],
                            "username": user["username"],
                        },
                    }
                ),
                200,
            )

        # No valid token or user not found.
        return jsonify({"authenticated": False}), 200

    except Exception as e:
        current_app.logger.error("Auth check error: %s", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        user = User.find_by_email(current_user)

        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Create new access token
            access_token = create_access_token(identity=current_user)

        response = jsonify(
            {
                "authenticated": True,
                "user": {
                    "email": user["email"],
                    "username": user["username"],
                },
            }
        )
        
        # Set new access token in cookie
        set_access_cookies(response, access_token)
        
        return response
        
    except Exception as e:
        current_app.logger.error("Token refresh error: %s", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500
