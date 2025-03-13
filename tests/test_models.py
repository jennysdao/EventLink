from models import User, Event, RSVP
from datetime import datetime, timezone
from database import db


def test_create_user(session):
    user = User(username="testuser", password="securepass", email="test@example.com")
    session.add(user)
    session.commit()

    retrieved_user = session.query(User).filter_by(username="testuser").first()
    assert retrieved_user is not None
    assert retrieved_user.email == "test@example.com"

def test_create_event(session):
    user = User(username="eventcreator", password="pass123", email="creator@example.com")
    session.add(user)
    session.commit()

    event = Event(title="Test Event", description="A test event", location="Test Location", organizer_id=user.id)
    session.add(event)
    session.commit()

    retrieved_event = session.query(Event).filter_by(title="Test Event").first()
    assert retrieved_event is not None
    assert retrieved_event.organizer_id == user.id

def test_create_rsvp(session):
    user = User(username="attendee", password="pass123", email="attendee@example.com")
    session.add(user)
    session.commit()

    event = Event(title="Meetup", description="Networking event", location="NYC", organizer_id=user.id)
    session.add(event)
    session.commit()

    rsvp = RSVP(user_id=user.id, event_id=event.id)
    session.add(rsvp)
    session.commit()

    retrieved_rsvp = session.query(RSVP).filter_by(user_id=user.id, event_id=event.id).first()
    assert retrieved_rsvp is not None
    assert retrieved_rsvp.timestamp is not None
    assert isinstance(retrieved_rsvp.timestamp, datetime)

def test_unique_constraints(session):
    user1 = User(username="uniqueuser", password="pass", email="unique@example.com")
    session.add(user1)
    session.commit()

    user2 = User(username="uniqueuser", password="pass", email="other@example.com")
    
    session.add(user2)
    try:
        session.commit()
        assert False, "Expected IntegrityError due to duplicate username"
    except Exception:
        session.rollback()

    user3 = User(username="differentuser", password="pass", email="unique@example.com")
    session.add(user3)
    try:
        session.commit()
        assert False, "Expected IntegrityError due to duplicate email"
    except Exception:
        session.rollback()
