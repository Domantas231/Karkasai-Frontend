import './headerImage.css'

interface HeaderImageProps {
    title: string,
    subtitle: string,
    children?: React.ReactNode,
    imgHeight?: string
}

function HeaderImage({title, subtitle, children, imgHeight} : HeaderImageProps) {
    return (
        <div className="container-fluid position-relative header-image-container p-0">
            <div className="header-overlay"></div>
            
            <div className="text-center position-absolute start-50 top-50 translate-middle px-3" style={{zIndex: 2, width: '100%', maxWidth: '800px'}}>
                <h1 className="display-1 header-title text-white">{title}</h1>
                <p className="header-subtitle text-white-50 fs-5">{subtitle}</p>
                {children}
            </div>
            
            <img 
                style={{height: imgHeight}} 
                className="shadow" 
                id="header-img" 
                src="https://picsum.photos/4000/2000"
                alt={title}
                loading="lazy"
            />
        </div>
    )
}

export default HeaderImage