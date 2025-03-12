from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from routes.auth import auth_bp
from routes.events import events_bp

# configured placeholder JWT key, 
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'test-secret'  # replace with a secure key

# register blueprints for modular routes
app.register_blueprint(auth_bp, url_prefix = '/api/auth')
app.register_blueprint(events_bp, url_prefix='/api/events')

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)