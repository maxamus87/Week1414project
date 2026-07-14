import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        Brew Local
      </Link>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Shops
        </NavLink>
        {user ? (
          <>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/shops/new">Add a shop</NavLink>
            <span className="navbar__user">Hi, {user.name}</span>
            <button type="button" onClick={logout} className="navbar__logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
