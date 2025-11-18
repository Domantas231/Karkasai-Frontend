import { useEffect, useState } from "react"

import GroupInline from "./GroupInline"
import SearchHelper from "./SearchHelper"

import { GroupForL } from "./models"

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
            title: "Bėgiojimas vakarais",
            currMem: 3,
            maxMem: 5,
            desc: "Bėgiojam vakarais 20:00 prie mergelių tilto į panemunės šilą!",
            tags: ['patyrusiem', 'naujokam'],
            imageUrl: "https://picsum.photos/50/50"
        },
        {
            title: "Bėgiojimas rytais",
            currMem: 5,
            maxMem: 8,
            desc: "Bėgiojam rytais 9:00 prie mergelių tilto į panemunės šilą!",
            tags: ['patyrusiem', 'pradinokam', 'penkiolika'],
            imageUrl: "https://picsum.photos/50/50"
        },
        {
            title: "Bėgiojimas dienomis",
            currMem: 10,
            maxMem: 12,
            desc: "Bėgiojam dienomis 13:00 prie mergelių tilto į panemunės šilą!",
            tags: ['ketvirtas', 'astuntas', 'devintas'],
            imageUrl: "https://picsum.photos/50/50"
        }
    ]

    return (
        <div className="container">
            <div className="row text-center py-4" style={{"textShadow": "2px 2px 4px black"}}>
                <div className="col-4">
                    <h4>Visos grupės</h4>
                </div>
                <SearchHelper searchInput={searchInput} setSearchInput={setSearchInput} handleOnClick={() => {setFilter(searchInput)}}/>
            </div>

            <div className="list-group mb-5">
                { filter !== '' ?
                groups.filter(g => g.title.toLowerCase().includes(filter.toLowerCase())).map(g => <GroupInline {... g} imageUrl='https://picsum.photos/50/50' />)
                :
                groups.map(g => <GroupInline {...g} imageUrl='https://picsum.photos/50/50' />)}
            </div>
        </div>
    )
}

export default AllGroups