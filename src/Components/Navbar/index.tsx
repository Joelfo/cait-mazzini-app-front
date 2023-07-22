import "./styles.css";
import CaitMazziniLogo from "../../assets/images/cait-mazzini-logo.png";
import '@popperjs/core';
import 'bootstrap/js/src/collapse';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md bg-primary main-nav">
      <div className="container">
        <a href="home" className="d-flex align-items-center">
          <img src={CaitMazziniLogo} alt="logo do CAIT Mazzini Bueno" />
          <h4>CAIT Mazzini Bueno e CASIC</h4>
        </a>
        
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        
        

        <div className="collapse navbar-collapse d-md-flex flex-md-row-reverse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
                <a href="Home">
                    Inicio
                </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
