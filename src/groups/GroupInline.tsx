import { useNavigate } from "react-router-dom";

import Tag from "./Tag"

import { TagModel } from "../shared/models";
import backend from "../shared/backend";
import config from "../shared/config";

import appState from "../shared/appState";

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
    const navigate = useNavigate();

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await backend.put(`${config.backendUrl}groups/${id}/join`)
            navigate(`/group/${id}`)
        }
        catch(error){
            console.log(error)
        }
    }

    console.log("group for l inside: ", imageUrl)

    return (
        <a href={`/group/${id}`} className="list-group-item list-group-item-action">
            <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-start align-items-md-center gap-2">
                <div className="d-flex align-items-center min-width-0 flex-grow-1 flex-shrink-1" style={{ minWidth: 0 }}>
                    <img src={imageUrl} className="rounded shadow me-3 flex-shrink-0" style={{ width: '50px', height: '50px', objectFit: 'cover' }}/>
                    <div style={{ minWidth: 0 }}>
                        <h5 className="mb-1 text-truncate">{title}</h5>
                        <p className="mb-1 text-truncate text-muted" style={{ maxWidth: '300px' }}>{description}</p>
                    </div>
                </div>
                
                <div className="d-flex align-items-center flex-shrink-0 gap-2 flex-wrap">
                    <div className="d-flex flex-wrap gap-1">
                        {tags.map((t, index) => (
                            t.usable && <Tag key={index} name={t.name} />
                        ))}
                    </div>
                    <span className="badge text-bg-primary rounded-pill">{currentMembers} / {maxMembers}</span>
                    { appState.userTitle !== "" && (
                        <button 
                            className="btn btn-primary fw-bold"
                            onClick={handleJoin}
                            style={{
                                background: 'green',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                            disabled={currentMembers >= maxMembers}
                        >
                            {currentMembers >= maxMembers ? 'Grupė pilna' : 'Prisijungti'}
                        </button>
                    )}
                </div>
            </div>
        </a>
    )
}

export default GroupInline