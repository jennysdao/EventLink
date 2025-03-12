from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from routes.auth import auth_bp
from routes.events import events_bp

# configured placeholder JWT key, 
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'test-secret'  # replace with a secure key
