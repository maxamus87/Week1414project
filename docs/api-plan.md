# API Plan

| Method | Endpoint | Purpose | Auth required |
|--------|----------|---------|----------------|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/auth/me` | Get the logged-in user's profile | Yes |
| GET | `/api/shops` | List shops (supports `?search=`, `?city=`, `?sort=name\|rating\|newest`) | No |
| GET | `/api/shops/:id` | Get one shop with its reviews | No |
| POST | `/api/shops` | Create a shop | Yes |
| PUT | `/api/shops/:id` | Update a shop you created | Yes (owner) |
| DELETE | `/api/shops/:id` | Delete a shop you created | Yes (owner) |
| POST | `/api/shops/:id/reviews` | Add a review to a shop | Yes |
| PUT | `/api/reviews/:id` | Update your own review | Yes (owner) |
| DELETE | `/api/reviews/:id` | Delete your own review | Yes (owner) |
| GET | `/api/favorites` | List the current user's favorited shops | Yes |
| POST | `/api/favorites` | Favorite a shop (`{ shopId }`) | Yes |
| DELETE | `/api/favorites/:shopId` | Un-favorite a shop | Yes |

All responses are JSON. Successful writes return `{ message, data }`; errors return `{ message }` with an appropriate 4xx/5xx status code.
