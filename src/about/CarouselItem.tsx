interface CarouselItemProps {
    desc: string,
    imageUrl: string
}

function CarouselItemAbout({desc, imageUrl} : CarouselItemProps){
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-auto" style={{width: "100px", wordWrap: "break-word"}}>
                    <p style={{"textShadow": "2px 2px 4px black"}}>{desc}</p>
                </div>
                <div className="col-auto">
                    <img className="rounded shadow" src={imageUrl}/>
                </div>
            </div>
        </div>
    )
}

export default CarouselItemAbout