function Navbar(){
    return (
        <header> 
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand ms-5" style={{'textShadow': '2px 2px 4px black'}} href="/">HabitTribe</a>
                <div className="container-fluid justify-content-center">
                    <ul className="navbar-nav">
                        <li id="newGroup" className="nav-item"><a className="nav-link" href="/new-group">Sukurti naują grupę</a></li>
                        <li id="groups" className="nav-item"><a className="nav-link" href="/groups">Esamos grupės</a></li>
                    </ul>
                </div>
                <a className="btn btn-secondary me-5" href="/groups">Prisijungti</a>
            </nav>
        </header>
    )
}

export { Navbar }