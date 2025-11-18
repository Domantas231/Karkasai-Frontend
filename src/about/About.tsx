import HeaderImage from '../shared/headerimage/headerImage';
import './About.css'
import CarouselAbout from './Carousel';

function About() {
    return (
        <>
            <HeaderImage title="HabitTribe" subtitle="Geriausias ir naujausias būdas formuoti įpročius!" imgHeight='500px'>
                <button id="login-button-main" type="button" className="btn btn-secondary mt-4 fw-bold fs-6 w-auto shadow">Registruokis!</button>
            </HeaderImage>
            <CarouselAbout />
        </>
    )
}

export default About;