-- Demo password for both users is: password123
INSERT INTO users (email, password_hash, name)
VALUES
  ('maria@example.com', '$2b$10$KeE4ed5iNFH74.YvQe3TRO8mzzWPfNNZdcy2qecLXHUhtsNZp.kZK', 'Maria Chen'),
  ('devon@example.com', '$2b$10$KeE4ed5iNFH74.YvQe3TRO8mzzWPfNNZdcy2qecLXHUhtsNZp.kZK', 'Devon Reyes');

INSERT INTO shops (name, address, city, state, description, website, latitude, longitude, created_by)
VALUES
  ('Rooted Coffee House', '412 Elm St', 'Asheville', 'North Carolina', 'Cozy neighborhood roaster with single-origin pour-overs.', 'https://rootedcoffee.example.com', 35.5951, -82.5515, 1),
  ('The Daily Grind', '89 Market Ave', 'Asheville', 'North Carolina', 'Fast, friendly espresso bar near downtown.', NULL, 35.5978, -82.5540, 1),
  ('Foothills Roast Co.', '215 Ridge Rd', 'Hendersonville', 'North Carolina', 'Small-batch roastery with a quiet reading nook.', 'https://foothillsroast.example.com', 35.3187, -82.4610, 2),
  ('5th & Bean', '5 Fifth St', 'Hendersonville', 'North Carolina', 'Family-owned shop known for its oat milk lattes.', NULL, 35.3210, -82.4585, 2);

INSERT INTO reviews (shop_id, user_id, rating, comment)
VALUES
  (1, 2, 5, 'Best pour-over in town, super welcoming staff.'),
  (1, 1, 4, 'Great coffee, gets crowded on weekend mornings.'),
  (2, 2, 3, 'Solid quick stop but seating is limited.'),
  (3, 1, 5, 'Quiet spot, perfect for working. Excellent light roast.'),
  (4, 1, 4, 'Loved the oat milk latte, friendly owners.');

INSERT INTO favorites (user_id, shop_id, saved, visited)
VALUES
  (1, 3, TRUE, TRUE),
  (1, 4, TRUE, FALSE),
  (2, 1, TRUE, TRUE);
