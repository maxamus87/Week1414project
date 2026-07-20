import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Where's My Coffee?</span>
          <p className="footer__tagline">Find, rate, and remember your favorite local coffee shops.</p>
        </div>

        <nav className="footer__links">
          <Link to="/">Shops</Link>
          {user ? (
            <>
              <Link to="/favorites">Favorites</Link>
              <Link to="/visited">Visited</Link>
              <Link to="/shops/new">Add a shop</Link>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </div>

      <p className="footer__credit">Built for a Week 14-15 Full-Stack Application Project &copy; 2026</p>
    </footer>
  );
}
