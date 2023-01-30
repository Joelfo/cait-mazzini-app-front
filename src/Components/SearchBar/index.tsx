import "./styles.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <form className="row search-form">
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome ou código do paciente"
          ></input>
        </div>
        <div className="col-3">
          <button type="submit" className="btn btn-primary">
            <h6>Buscar</h6>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
