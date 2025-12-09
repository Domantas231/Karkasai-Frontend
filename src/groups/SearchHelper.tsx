interface SearchHelperProps {
    handleOnClick?: | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
    searchInput: string,
    setSearchInput: Function
}

function SearchHelper({handleOnClick, searchInput, setSearchInput} : SearchHelperProps){
    return (
        <>
            <div className="offset-2 offset-md-3 col-4">
                <input className="form-control me-2" value={searchInput} placeholder="Ieškokite grupių pagal pavadinimą..." aria-label="Search" 
                onChange={e => setSearchInput(e.target.value)}/>
            </div>
            <div className="col-1">
                <button onClick={handleOnClick} className="btn btn-outline-success">Ieškoti</button>
            </div>
        </>
    )
}

export default SearchHelper