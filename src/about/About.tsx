import HeaderImage from '../shared/headerimage/headerImage';
import './About.css'
import CarouselAbout from './Carousel';

import appState from '../shared/appState';

function About() {
    return (
        <>
            {/* Hero Section */}
            <HeaderImage title="HabitTribe" subtitle="Geriausias ir naujausias būdas formuoti įpročius!" imgHeight='600px'>
                <div className="mt-4">
                    {appState.userTitle == "" ? (
                        <a href="/register">
                            <button 
                                id="login-button-main" 
                                type="button" 
                                className="btn btn-primary btn-lg fw-bold shadow-lg px-5 py-3"
                                style={{
                                    borderRadius: '50px',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                Registruokis dabar!
                            </button>
                        </a>
                    ) : 
                    (
                        <a href="/groups">
                            <button 
                                id="login-button-main" 
                                type="button" 
                                className="btn btn-primary btn-lg fw-bold shadow-lg px-5 py-3"
                                style={{
                                    borderRadius: '50px',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                Peržiūrėk esamas grupes!
                            </button>
                        </a>
                    )}
                    
                </div>
            </HeaderImage>

            {/* Features Section */}
            <div className="container py-5">
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="display-4 fw-bold mb-3">Kodėl HabitTribe?</h2>
                        <p className="lead text-muted">Prisijunk prie bendruomenės ir pasieks savo tikslus greičiau!</p>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div 
                            className="card h-100 border-0 shadow-sm"
                            style={{borderRadius: '16px', transition: 'transform 0.3s ease', backgroundColor: "#4E5B69"}}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 mx-auto d-flex align-items-center justify-content-center">
                                    <img 
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#fff3e6'
                                        }}
                                    src="https://picsum.photos/80/80" />
                                </div>
                                <h4 className="fw-bold mb-3">Rask bendraminčius</h4>
                                <p className="text-muted">
                                    Susirask žmones su panašiais tikslais ir formuokite įpročius kartu. 
                                    Grupė padeda išlikti motyvuotam!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div 
                            className="card h-100 border-0 shadow-sm"
                            style={{borderRadius: '16px', transition: 'transform 0.3s ease', backgroundColor: "#4E5B69"}}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 mx-auto d-flex align-items-center justify-content-center">
                                    <img 
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#fff3e6'
                                        }}
                                    src="https://picsum.photos/80/80" />
                                </div>
                                <h4 className="fw-bold mb-3">Sek pažangą</h4>
                                <p className="text-muted">
                                    Dalinkis savo pasiekimais, motyvuok kitus ir sek savo pažangą 
                                    įpročių formavimo kelyje.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div 
                            className="card h-100 border-0 shadow-sm"
                            style={{borderRadius: '16px', transition: 'transform 0.3s ease', backgroundColor: "#4E5B69"}}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 mx-auto d-flex align-items-center justify-content-center">
                                    <img 
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#fff3e6'
                                        }}
                                    src="https://picsum.photos/80/80" />
                                </div>
                                <h4 className="fw-bold mb-3">Pasieks tikslus</h4>
                                <p className="text-muted">
                                    Kartu su grupe tikslai tampa lengviau pasiekiami. 
                                    Bendri iššūkiai ir palaikymas veda į sėkmę!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Carousel */}
            <div className="py-5">
                <CarouselAbout />
            </div>
        </>
    )
}

export default About;