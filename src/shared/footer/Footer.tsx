import './Footer.css'

import appState from '../appState';

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="site-footer mt-auto">
            <div className="footer-content">
                <div className="container">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <a href="/" className="footer-logo">
                                {/* <i className="bi bi-people-fill"></i> */}
                                <img className="" src="src/assets/habittribe.svg" width={30} height={30}/>
                                <span>HabitTribe</span>
                            </a>
                            <p className="footer-tagline">Kartu kuriame geresnius įpročius</p>
                        </div>

                        <div className="footer-links">
                            <h6>Nuorodos</h6>
                            <ul>
                                { appState.userTitle != "" && (
                                    <>
                                        <li><a href="/tags"><i className="bi bi-tags me-2"></i>Žymos</a></li>
                                        <li><a href="/new-group"><i className="bi bi-plus-circle me-2"></i>Nauja grupė</a></li>
                                    </>
                                )}
                                <li><a href="/groups"><i className="bi bi-collection me-2"></i>Grupės</a></li>
                            </ul>
                        </div>

                        <div className="footer-social">
                            <h6>Susisiekite</h6>
                            <div className="social-icons">
                                <a href="https://github.com/Domantas231" aria-label="GitHub"><i className="bi bi-github"></i></a>
                                <a href="https://www.linkedin.com/in/domantas-bieliūnas-781060224/" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <span className="copyright">
                            © {currentYear} HabitTribe
                        </span>
                        <span className="author">
                            IFF-2/6 Domantas Bieliūnas
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }