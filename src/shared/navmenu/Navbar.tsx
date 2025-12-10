import { useState, useEffect } from "react"
import appState from "../appState"
import Auth from "../../auth/auth"
import './navbar.css'

interface NavbarProps {
    isSignalRConnected?: boolean;
}

function Navbar({ isSignalRConnected = false }: NavbarProps){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    // Track window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // Auto-close menu when resizing to desktop
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when clicking a link (mobile)
    const handleLinkClick = () => {
        if (windowWidth < 768) {
            setIsMenuOpen(false);
        }
    };

    // Check if user is logged in
    const isLoggedIn = appState.userTitle !== "";
    
    // Check if user is admin
    const isAdmin = appState.isUserAdmin;

    return (
        <header> 
            <nav className="navbar navbar-dark fixed-top bg-dark shadow-lg">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        {/* <i className="bi bi-people-fill me-2 text-primary"></i> */}
                        <img className="me-2" src="src/assets/habittribe.svg" width={30} height={30}/>
                        <span className="brand-text">HabitTribe</span>
                    </a>

                    <button 
                        className={`navbar-toggler d-md-none ${isMenuOpen ? '' : 'collapsed'}`}
                        type="button" 
                        onClick={toggleMenu}
                        aria-controls="navbarMain"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="desktop-nav d-none d-md-flex align-items-center flex-grow-1">
                        <ul className="navbar-nav mx-auto mb-0 flex-row">
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="/new-group">
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Sukurti grupę
                                        </a>
                                    </li>
                                    {/* Only show Tags management for Admins */}
                                    {isAdmin && (
                                        <li className="nav-item">
                                            <a className="nav-link d-flex align-items-center" href="/tags">
                                                <i className="bi bi-tags me-2"></i>
                                                Žymos
                                            </a>
                                        </li>
                                    )}
                                </>
                            )}
                            <li className="nav-item">
                                <a className="nav-link d-flex align-items-center" href="/groups">
                                    <i className="bi bi-collection me-2"></i>
                                    Esamos grupės
                                </a>
                            </li>
                        </ul>

                        <div className="auth-section d-flex align-items-center gap-2">
                            <Auth />
                        </div>
                    </div>

                    <div className={`mobile-nav d-md-none ${isMenuOpen ? 'show' : ''}`} id="navbarMain">
                        <ul className="navbar-nav">
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/new-group" onClick={handleLinkClick}>
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Sukurti grupę
                                        </a>
                                    </li>
                                    {/* Only show Tags management for Admins */}
                                    {isAdmin && (
                                        <li className="nav-item">
                                            <a className="nav-link" href="/tags" onClick={handleLinkClick}>
                                                <i className="bi bi-tags me-2"></i>
                                                Žymos
                                            </a>
                                        </li>
                                    )}
                                </>
                            )}
                            <li className="nav-item">
                                <a className="nav-link" href="/groups" onClick={handleLinkClick}>
                                    <i className="bi bi-collection me-2"></i>
                                    Esamos grupės
                                </a>
                            </li>
                        </ul>

                        <div className="auth-section-mobile">
                            <Auth />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export { Navbar }