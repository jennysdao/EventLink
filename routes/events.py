from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Event

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
def get_events():
    category = request.args.get('category')
    query = Event.query
    if category:
        query = query.filter(Event.description.contains(category))
    events = query.all()
    events_list = [{"id": e.id, "title": e.title, "location": e.location} for e in events]
    return jsonify(events_list), 200

@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    data = request.get_json()
    current_user = get_jwt_identity()
    new_event = Event(
        title=data.get('title'),
        description=data.get('description'),
        location=data.get('location'),
        organizer_id=data.get('organizer_id') 
    )

    db.session.add(new_event)
    db.session.commit()
    return jsonify({"msg": "Event created", "event": new_event.id}), 201