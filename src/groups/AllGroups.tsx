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
                console.log(config.backendUrl + 'group')
                const response = await backend.get<GroupForL[]>(config.backendUrl + 'group')
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
                groupsExample.filter(g => g.title.toLowerCase().includes(filter.toLowerCase())).map((g, index) => 
                    <GroupInline 
                        key={g.title} 
                        id={index + 1} 
                        title={g.title}
                        currentMembers={g.currentMembers}
                        maxMembers={g.maxMembers}
                        description={g.description}
                        tags={g.tags}
                        imageUrl='https://picsum.photos/50/50' 
                    />
                )
                :
                groupsExample.map((g, index) => 
                    <GroupInline 
                        key={g.title} 
                        id={index + 1}
                        title={g.title}
                        currentMembers={g.currentMembers}
                        maxMembers={g.maxMembers}
                        description={g.description}
                        tags={g.tags}
                        imageUrl='https://picsum.photos/50/50' 
                    />
                )}
            </div>
        </div>
    )
}

export default AllGroups