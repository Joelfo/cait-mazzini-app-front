import "./assets/styles/custom.scss";
import './App.css';
import Navbar from './Components/Navbar';
import AddButton from "Components/AddButton";
import PersonIconButton from "Components/PersonIconButton";
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
