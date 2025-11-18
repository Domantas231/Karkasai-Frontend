import Tag from "./Tag"

interface InlineGroupProps {
    title: string,
    currentMembers: number,
    maxMembers: number,
    description: string,
    tags: string,
    imageUrl: string
}

function GroupInline({title, currentMembers, maxMembers, description, tags, imageUrl} : InlineGroupProps){
    return (
        <a href="#" className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src={imageUrl} className="rounded shadow me-3"/>
                    <div>
                        <h5 className="mb-1">{title}</h5>
                        <p className="mb-1">{description}</p>
                    </div>
                </div>
                
                <div>
                    <Tag name={tags} />
                    {/* {tags.map(t => <Tag name={t} />)} */}
                </div>
                <span className="badge text-bg-primary rounded-pill">{currentMembers} / {maxMembers}</span>
            </div>
        </a>
    )
}

export default GroupInline