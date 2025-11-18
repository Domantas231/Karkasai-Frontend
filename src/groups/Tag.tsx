interface TagProps{
    name: string
}

function Tag({name} : TagProps){
    return (
        <button className="btn btn-primary my-2 mx-1" type="button">{name}</button>
    )
}

export default Tag