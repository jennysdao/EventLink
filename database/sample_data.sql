-- Use the correct database
USE eventLinkDB;

-- Insert sample users
INSERT INTO users (username, hashed_password, email) VALUES
('alice_johnson', 'hashedpassword123', 'alice@example.com'),
('bob_smith', 'hashedpassword456', 'bob@example.com'),
('charlie_brown', 'hashedpassword789', 'charlie@example.com');

-- Insert sample events
INSERT INTO events (title, description, event_time, location, organizer_id) VALUES
('Tech Conference 2025', 'A networking event for tech enthusiasts.', '2025-03-15 10:00:00', 'Main Auditorium', 1),
('Football Match', 'University league finals.', '2025-04-20 18:00:00', 'Campus Stadium', 2),
('Art Workshop', 'Painting techniques for beginners.', '2025-05-10 14:00:00', 'Art Building', 3);

-- Insert sample RSVPs
INSERT INTO rsvps (user_id, event_id) VALUES
(1, 1),  -- Alice attending Tech Conference
(2, 2),  -- Bob attending Football Match
(3, 3),  -- Charlie attending Art Workshop
(1, 2);  -- Alice also attending Football Match
