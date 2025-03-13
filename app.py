from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from routes.auth import auth_bp
from routes.events import events_bp
from flask import SQLAlchemy
from config import config

# configured placeholder JWT key, 
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'test-secret'  # replace with a secure key

app.config.from_object('config.Config')
db = SQLAlchemy(app)

# register blueprints for modular routes
app.register_blueprint(auth_bp, url_prefix = '/api/auth')
app.register_blueprint(events_bp, url_prefix='/api/events')

# add the Swagger docs endpoint
@app.route("/api/docs")
def docs():
    swag = swagger(app)
    swag['info']['title'] = "EventLink API"
    swag['info']['version'] = "1.0"
    return jsonify(swag)

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)