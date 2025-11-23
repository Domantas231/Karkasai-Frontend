import Tag from "./Tag"

import { TagModel } from "../shared/models";

interface InlineGroupProps {
    id?: number,
    title: string,
    currentMembers: number,
    maxMembers: number,
    description: string,
    tags: TagModel[],
    imageUrl: string
}

function GroupInline({id = 1, title, currentMembers, maxMembers, description, tags, imageUrl} : InlineGroupProps){
    return (
        <a href={`/group/${id}`} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src={imageUrl} className="rounded shadow me-3"/>
                    <div>
                        <h5 className="mb-1">{title}</h5>
                        <p className="mb-1">{description}</p>
                    </div>
                </div>
                
                <div>
                    {tags.map(t => <Tag name={t.name} />)}
                </div>
                <span className="badge text-bg-primary rounded-pill">{currentMembers} / {maxMembers}</span>
            </div>
        </a>
    )
}

export default GroupInline