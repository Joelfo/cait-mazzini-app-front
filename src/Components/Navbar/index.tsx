import "./styles.css";
import CaitMazziniLogo from "../../assets/images/cait-mazzini-logo.png";
import '@popperjs/core';
import 'bootstrap/js/src/collapse';
import { Link } from "react-router-dom";
import { useUserContext } from "Contexts/useUserContext";
import { EUserRole } from "Api/Types/enums/EUserRole";

const Navbar = () => {
  const user = useUserContext();
  return (
    <nav className="navbar navbar-expand-md bg-primary main-nav">
      <div className="container">
        <Link to="/home">
          <div className="d-flex align-items-center">
            <img style={{borderRadius: '2.5px'}} src={CaitMazziniLogo} alt="logo do CAIT Mazzini Bueno" />
            <h4>CAIT Mazzini Bueno e CASIC</h4>
          </div>
        </Link>
        
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
                <Link to="/home">
                    Inicio
                </Link>
            </li>
            {
              user.role === EUserRole.Admin
              &&
              <li className="nav-item">
                <Link to="/adminPainel">
                  Administrador
                </Link>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
