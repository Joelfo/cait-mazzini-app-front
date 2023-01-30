import './styles.css';
import AddButton from "Components/AddButton"
import PersonIconButton from "Components/PersonIconButton"
import SearchBar from "Components/SearchBar";

const ReceptionistHome = () => {
    return(
        <div className="receptionist-home-container container">
            <div className="top-container d-flex justify-content-evenly align-items-center">
            <AddButton/>
            <SearchBar/>
            <PersonIconButton/>
            </div>
            <div className="bottom-container row">
                <div className="item-container col-2">
                    <PersonIconButton/>
                </div>
                <div className="item-container col-2">
                    <PersonIconButton/>
                </div>
                <div className="item-container col-2">
                    <PersonIconButton/>
                </div>
                <div className="item-container col-2">
                    <AddButton/>
                </div>
            </div>
        </div>
    )
}

export default ReceptionistHome;