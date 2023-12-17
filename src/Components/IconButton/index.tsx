import "./styles.css";
import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";

type Props  = {
    icon : JSX.Element;
    text : string;
    onClick?: () => void
}

const IconButton = ({ icon, text, onClick = () => {} } : Props) => {
    return(
        <div className="base-button-container">
      <div className="content-container">
        <button onClick={onClick} className="btn add-button icon-button bg-primary">
          <div className="icon-container">
            {icon}
          </div>
        </button>
        <div style={{width: 'auto', textAlign: 'justify', display: 'inline-block'}}>
          <p>{text}</p>
        </div>
      </div>
    </div>
    );
}

export default IconButton;