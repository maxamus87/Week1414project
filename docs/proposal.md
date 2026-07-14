# Project Proposal — Brew Local

**What is the application?**
Brew Local is a full-stack web app for discovering local, independently owned coffee shops. Users can browse and search shops, read and leave reviews with star ratings, and save favorites to their account.

**What problem does it solve?**
It's hard to find independent coffee shops (as opposed to chains) and hard to know which ones are actually good without relying on giant review platforms dominated by chains and paid placement. Brew Local is a small, focused directory just for local shops.

**Who is the target user?**
Coffee drinkers who want to support independent, local businesses and are looking for a simple way to discover and remember their favorite (or favorite-to-try) shops.

**What is the main resource being managed?**
`shops` — coffee shop listings (name, address, city, description, website).

**What CRUD actions will users perform?**
- Create: add a new shop listing, write a review, add a shop to favorites
- Read: browse/search/filter all shops, view one shop's details and reviews, view a user's list of favorites
- Update: edit a shop you created, edit a review you wrote
- Delete: delete a shop you created, delete a review you wrote, remove a shop from favorites

**What are the two (or more) related database tables?**
- `users` — accounts
- `shops` — coffee shop listings, each with a `created_by` foreign key to `users`
- `reviews` — one row per review, each with foreign keys to both `shops` and `users`
- `favorites` — a join table linking `users` to the `shops` they've favorited
