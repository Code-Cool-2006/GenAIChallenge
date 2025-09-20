import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-bleed">
        <div className="brand">Career AI</div>
        <div className="navbar-inner">
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/resume-builder">Resume Builder</Link>
            </li>
            <li>
              <Link to="/mock-interview">Mock Interview</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <img
          width="14 "
          height="14"
          src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png"
          alt="external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo"
          className="logo-vite"
        />
      </div>
    </nav>
  );
}

export default Navbar;
