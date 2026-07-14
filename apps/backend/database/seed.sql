-- Demo password for both users is: password123
INSERT INTO users (email, password_hash, name)
VALUES
  ('maria@example.com', '$2b$10$KeE4ed5iNFH74.YvQe3TRO8mzzWPfNNZdcy2qecLXHUhtsNZp.kZK', 'Maria Chen'),
  ('devon@example.com', '$2b$10$KeE4ed5iNFH74.YvQe3TRO8mzzWPfNNZdcy2qecLXHUhtsNZp.kZK', 'Devon Reyes');

INSERT INTO shops (name, address, city, description, website, created_by)
VALUES
  ('Rooted Coffee House', '412 Elm St', 'Asheville', 'Cozy neighborhood roaster with single-origin pour-overs.', 'https://rootedcoffee.example.com', 1),
  ('The Daily Grind', '89 Market Ave', 'Asheville', 'Fast, friendly espresso bar near downtown.', NULL, 1),
  ('Foothills Roast Co.', '215 Ridge Rd', 'Hendersonville', 'Small-batch roastery with a quiet reading nook.', 'https://foothillsroast.example.com', 2),
  ('5th & Bean', '5 Fifth St', 'Hendersonville', 'Family-owned shop known for its oat milk lattes.', NULL, 2);

INSERT INTO reviews (shop_id, user_id, rating, comment)
VALUES
  (1, 2, 5, 'Best pour-over in town, super welcoming staff.'),
  (1, 1, 4, 'Great coffee, gets crowded on weekend mornings.'),
  (2, 2, 3, 'Solid quick stop but seating is limited.'),
  (3, 1, 5, 'Quiet spot, perfect for working. Excellent light roast.'),
  (4, 1, 4, 'Loved the oat milk latte, friendly owners.');

INSERT INTO favorites (user_id, shop_id)
VALUES
  (1, 3),
  (1, 4),
  (2, 1);
