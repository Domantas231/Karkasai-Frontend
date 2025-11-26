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
                <div>
                    <span className="badge text-bg-primary rounded-pill mx-4">{currentMembers} / {maxMembers}</span>
                    {/* Join button */}
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