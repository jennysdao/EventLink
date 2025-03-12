from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

# dummy in-mem user store (replace with database integration later)
users = {}


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users:
        return jsonify({"msg": "User already exists"}), 400
    users[username] = password  # In production, hash passwords!
    return jsonify({"msg": "Registration successful"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if users.get(username) != password:
        return jsonify({"msg": "Invalid credentials"}), 401
    token = create_access_token(identity=username)
    return jsonify(access_token=token), 200