import { useEffect, useState } from "react"

import GroupInline from "./GroupInline"
import SearchHelper from "./SearchHelper"

import { GroupForL } from "../shared/models"

import config from '../shared/config'
import backend from "../shared/backend"

function AllGroups(){
    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState('')

    const [groups, setGroups] = useState<GroupForL[]>([])

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await backend.get<GroupForL[]>(config.backendUrl + 'groups')
                setGroups(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.log('Failed to fetch data');
            }
        }
        
        fetchGroups();
    }, [])
    

    let groupsExample = [
        {
            title: "BÄ—giojimas vakarais",
            currentMembers: 3,
            maxMembers: 5,
            description: "BÄ—giojam vakarais 20:00 prie mergeliÅ³ tilto Ä¯ panemunÄ—s Å¡ilÄ…!",
            tags: 'asdasda',
            //tags: ['patyrusiem', 'naujokam'],
            imageUrl: "https://picsum.photos/50/50"
        },
        {
            title: "BÄ—giojimas rytais",
            currentMembers: 5,
            maxMembers: 8,
            description: "BÄ—giojam rytais 9:00 prie mergeliÅ³ tilto Ä¯ panemunÄ—s Å¡ilÄ…!",
            tags: 'asdasda',
            //tags: ['patyrusiem', 'pradinokam', 'penkiolika'],
            imageUrl: "https://picsum.photos/50/50"
        },
        {
            title: "BÄ—giojimas dienomis",
            currentMembers: 10,
            maxMembers: 12,
            description: "BÄ—giojam dienomis 13:00 prie mergeliÅ³ tilto Ä¯ panemunÄ—s Å¡ilÄ…!",
            tags: 'asdasda',
            //tags: ['ketvirtas', 'astuntas', 'devintas'],
            imageUrl: "https://picsum.photos/50/50"
        }
    ]

    return (
        <div className="container">
            <div className="row text-center py-4" style={{"textShadow": "2px 2px 4px black"}}>
                <div className="col-4">
                    <h4>Visos grupÄ—s</h4>
                </div>
                <SearchHelper searchInput={searchInput} setSearchInput={setSearchInput} handleOnClick={() => {setFilter(searchInput)}}/>
            </div>

            <div className="list-group mb-5">
                { filter !== '' ?
                groups.filter(g => g.title.toLowerCase().includes(filter.toLowerCase())).map((g) => 
                    <GroupInline 
                        key={g.id} 
                        id={g.id} 
                        title={g.title}
                        currentMembers={g.currentMembers}
                        maxMembers={g.maxMembers}
                        description={g.description}
                        tags={g.tags}
                        imageUrl='https://picsum.photos/50/50' 
                    />
                )
                :
                groups.map((g) => 
                    <GroupInline 
                        key={g.id} 
                        id={g.id}
                        title={g.title}
                        currentMembers={g.currentMembers}
                        maxMembers={g.maxMembers}
                        description={g.description}
                        tags={g.tags}
                        imageUrl='https://picsum.photos/50/50' 
                    />
                )}
            </div>

            <div className="row my-5">
                <div className="col-12 text-center">
                    <div className="card border-0 shadow-lg text-body-secondary" style={{
                        borderRadius: '15px',
                        padding: '2rem'
                    }}>
                        <div className="card-body">
                            <h4 className="text-white fw-bold mb-3">
                                Neradai tinkamos grupės?
                            </h4>
                            <p className="text-white opacity-75 mb-4">
                                Sukurk savo grupę ir suburk bendraminčius!
                            </p>
                            <a 
                                href="/new-group" 
                                className="btn btn-light btn-lg fw-bold px-5"
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                }}
                            >
                                Sukurti naują grupę
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllGroups