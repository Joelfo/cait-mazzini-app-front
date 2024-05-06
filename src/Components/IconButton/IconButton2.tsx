import "./styles.css";

type IconButton2Props  = {
    text? : string;
    onClick?: () => void;
    iconClass: string;
    height?: string,
    width?: string,
    variant?: string,
    iconSize?: string
}


export const IconButton2 = ({ variant = 'primary', iconClass, text, onClick = () => {}, height = '100px', width = '100px', iconSize = '52px' } : IconButton2Props) => {
    return(
      <div className="content-container" style={{textAlign: 'center'}}>
        <button style={{height: height, width: width}} onClick={onClick} className={`btn add-button icon-button bg-${variant}`}>
          <div className="icon-container">
            <i className={'bi ' + iconClass} style={{color: 'white', fontSize: iconSize}}></i>
          </div>
        </button>
        {
          text && <p>{text}</p>
        }
      </div>
    );
}