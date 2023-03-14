import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import ReceptionistHome from "Pages/ReceptionistHome";

function App() {
  return (
    <>
    <div className="navbar-container">
    <Navbar/>
    </div>
    <ReceptionistHome/>
    </>
    
  );
}

export default App;
