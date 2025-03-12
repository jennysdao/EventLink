from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

# dummy in-mem user store (replace with database integration later)
users = {}
