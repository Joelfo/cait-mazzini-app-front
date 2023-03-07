import "./styles.css";
import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";

type Props  = {
    icon : JSX.Element;
}

const IconButton = ({ icon } : Props) => {
    return(
        <div className="base-button-container">
      <div className="content-container">
        <button className="btn add-button icon-button">
          <div className="icon-container">
            {icon}
          </div>
        </button>
        <p>Conteúdo</p>
      </div>
    </div>
    );
}

export default IconButton;