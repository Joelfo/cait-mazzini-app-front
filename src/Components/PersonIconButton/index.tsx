import { ReactComponent as PersonIcon } from "assets/images/person-icon.svg";

const PersonIconButton = () => {
  return (
    <div className="base-button-container">
      <div className="content-container">
        <button className="btn person-button base-button">
          <div className="icon-container">
            <PersonIcon />
          </div>
        </button>
        <p>Conteúdo</p>
      </div>
    </div>
  );
};

export default PersonIconButton;
