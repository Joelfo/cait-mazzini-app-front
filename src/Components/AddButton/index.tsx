import { ReactComponent as PlusIcon } from "assets/images/plus-icon.svg";

const AddButton = () => {
  return (
    <div className="base-button-container">
      <div className="content-container">
        <button className="btn add-button base-button">
          <div className="icon-container">
            <PlusIcon />
          </div>
        </button>
        <p>Conteúdo</p>
      </div>
    </div>
  );
};

export default AddButton;
