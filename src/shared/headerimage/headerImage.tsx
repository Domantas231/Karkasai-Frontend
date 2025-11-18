import './HeaderImage.css'

interface HeaderImageProps {
    title: string,
    subtitle: string,
    children?: React.ReactNode,
    imgHeight?: string
}

function HeaderImage({title, subtitle, children, imgHeight} : HeaderImageProps) {
    return (
        <div className="container-fluid position-relative">
            <div className="text-center position-absolute start-50 top-50 translate-middle">
                <h1 className="display-1" style={{"textShadow": "2px 2px 4px black"}}>{title}</h1>
                <p className="italic" style={{"textShadow": "2px 2px 4px black"}}>{subtitle}</p>
                {children}
            </div>
            <img style={{height: imgHeight}} className="shadow" id="header-img" src="https://picsum.photos/4000/2000"/>
        </div>
    )
}

export default HeaderImage