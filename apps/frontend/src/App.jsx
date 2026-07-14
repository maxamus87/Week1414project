import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopDetailPage from "./pages/ShopDetailPage.jsx";
import NewShopPage from "./pages/NewShopPage.jsx";
import EditShopPage from "./pages/EditShopPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shops/new" element={<ProtectedRoute><NewShopPage /></ProtectedRoute>} />
          <Route path="/shops/:id" element={<ShopDetailPage />} />
          <Route path="/shops/:id/edit" element={<ProtectedRoute><EditShopPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </>
  );
}
