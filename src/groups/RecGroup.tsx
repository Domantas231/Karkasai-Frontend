import Tag from "./Tag"

interface RecGroupProps {
    groupName: string,
    currMem: number,
    maxMem: number,
    desc: string,
    tags: Array<string>,
    imageUrl: string
}

function RecGroup({groupName, currMem, maxMem, desc, tags, imageUrl} : RecGroupProps) {
    return (
        <div className="col-4">
            <div className="card">
                <img src={imageUrl} className="card-img-top"/>
                <div className="card-body">
                    <div className="row">
                        <div className="col-8">
                            <h5 className="card-title">{groupName}</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">{currMem} iš {maxMem} vietų užpildytos</h6>
                            <p className="card-text">{desc}</p>
                            <a href="#" className="btn btn-primary">Prisijungti!</a>
                        </div>
                        <div className="col-4">
                            {tags.map(t => <Tag name={t} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecGroup