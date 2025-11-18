interface TagProps{
    name: string
}

function Tag({name} : TagProps){
    return (
        <button className="btn btn-primary my-2" type="button">{name}</button>
    )
}

export default Tag