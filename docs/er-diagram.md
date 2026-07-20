# Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ SHOPS : "creates"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ FAVORITES : "saves"
    SHOPS ||--o{ REVIEWS : "receives"
    SHOPS ||--o{ FAVORITES : "is saved as"

    USERS {
        int id PK
        varchar email UK
        varchar password_hash
        varchar name
        timestamp created_at
    }

    SHOPS {
        int id PK
        varchar name
        varchar address
        varchar city
        varchar state
        text description
        varchar website
        double latitude
        double longitude
        int created_by FK
        timestamp created_at
    }

    REVIEWS {
        int id PK
        int shop_id FK
        int user_id FK
        int rating
        text comment
        timestamp created_at
    }

    FAVORITES {
        int id PK
        int user_id FK
        int shop_id FK
        timestamp created_at
    }
```

## Relationships
- One `user` can create many `shops` (`shops.created_by → users.id`).
- One `shop` can have many `reviews`; one `user` can write many `reviews` (`reviews.shop_id → shops.id`, `reviews.user_id → users.id`).
- `favorites` is a join table connecting `users` and `shops` in a many-to-many relationship, with a unique constraint on `(user_id, shop_id)` so a shop can only be favorited once per user.
