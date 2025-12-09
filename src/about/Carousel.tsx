import Carousel from 'react-bootstrap/carousel'
import CarouselItemAbout from "./CarouselItem"

function CarouselAbout() {
    return (
        <div className="container bg-secondary-subtle py-5">
            <h4 className="text-center pt-4 pb-4" style={{"textShadow": "2px 2px 4px black"}}>Pasižiūrėk kaip sekasi mūsų naudotojams!</h4>
            <Carousel slide className='py-4' indicators={false}>
                <Carousel.Item>
                    <CarouselItemAbout desc='Pirmas' imageUrl='https://picsum.photos/300/200'/>
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselItemAbout desc='Antras' imageUrl='https://picsum.photos/300/200'/>
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselItemAbout desc='Trečias' imageUrl='https://picsum.photos/300/200'/>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default CarouselAbout