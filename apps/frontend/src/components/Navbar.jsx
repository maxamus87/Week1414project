import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar__bar">
        <Link to="/" className="navbar__brand">
          Where's My Coffee?
        </Link>
        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`navbar__links${isOpen ? " navbar__links--open" : ""}`}>
        <NavLink to="/" end>
          Shops
        </NavLink>
        {user ? (
          <>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/visited">Visited</NavLink>
            <NavLink to="/shops/new">Add a shop</NavLink>
            <span className="navbar__account">
              <span className="navbar__user">Hi, {user.name}</span>
              <button type="button" onClick={logout} className="navbar__logout">
                Log out
              </button>
            </span>
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
