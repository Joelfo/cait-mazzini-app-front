import "./styles.css";
import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";

type Props  = {
    icon : JSX.Element;
    text : string;
}

const IconButton = ({ icon, text } : Props) => {
    return(
        <div className="base-button-container">
      <div className="content-container">
        <button className="btn add-button icon-button">
          <div className="icon-container">
            {icon}
          </div>
        </button>
        <p>{text}</p>
      </div>
    </div>
    );
}

export default IconButton;