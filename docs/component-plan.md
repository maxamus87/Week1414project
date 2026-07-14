# Component Plan

```
App
├── Navbar
├── HomePage
│   ├── SearchFilterBar
│   └── ShopList
│       └── ShopCard
├── ShopDetailPage
│   ├── FavoriteButton
│   ├── ReviewForm
│   └── ReviewList
├── NewShopPage
│   └── ShopForm
├── EditShopPage
│   └── ShopForm
├── FavoritesPage
│   └── ShopList
│       └── ShopCard
├── LoginPage
├── RegisterPage
├── ProtectedRoute (route guard, not visual)
├── LoadingMessage (shared)
├── ErrorMessage (shared)
└── EmptyState (shared)
```

Shared context: `AuthContext` provides `user`, `token`, `login`, `register`, and `logout` to any component via `useAuth()`.
