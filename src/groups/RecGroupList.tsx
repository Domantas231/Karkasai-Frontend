import { useState, useEffect } from 'react';

import RecGroup from "./RecGroup";
import { GroupForL } from '../shared/models';
import backend from '../shared/backend';
import config from '../shared/config';

function RecGroupList(){
    const [groups, setGroups] = useState<GroupForL[]>()

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

    // let groupsExample = [
    //     {
    //         groupName: "Bėgiojimas",
    //         currMem: 5,
    //         maxMem: 7,
    //         desc: "Bėgiojam rytais 9:00 prie mergelių tilto į panemunės šilą!",
    //         tags: ['patyrusiem', 'naujokam', 'turneriai'],
    //         imageUrl: "https://picsum.photos/300/300"
    //     },
    //     {
    //         groupName: "Sveikas maitinimasis",
    //         currMem: 3,
    //         maxMem: 4,
    //         desc: "Kiekvieną dieną keliame receptus ir dalinamies savais sunkumais.",
    //         tags: ['Virs 60m', 'kaunas', 'centras'],
    //         imageUrl: "https://picsum.photos/300/300"
    //     },
    //     {
    //         groupName: "Knygų skaitymas",
    //         currMem: 10,
    //         maxMem: 12,
    //         desc: "Pasikalbam apie knygas ir dalinamies rekomendacijomis! Prie to pačio susitinkam sekmadieniais.",
    //         tags: ['ketvirtas', 'astuntas', 'devintas'],
    //         imageUrl: "https://picsum.photos/300/300"
    //     }
    // ]

    let groupsExample = groups?.slice(0, 3)

    return (
        <div className="container pt-5">
            <div className="row text-center mb-5">
                <div className="col-12">
                    <div style={{
                        display: 'inline-block',
                        position: 'relative',
                        padding: '0 2rem'
                    }}>
                        <h2 className="display-5 fw-bold mb-2" style={{
                            color: 'white',
                            backgroundClip: 'text'
                        }}>
                            Rekomenduojamos grupės
                        </h2>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                {groupsExample?.map((g) => (
                    <RecGroup 
                        key={g.id}
                        groupName={g.title}
                        currMem={g.currentMembers}
                        maxMem={g.maxMembers}
                        desc={g.description}
                        tags={g.tags}
                        imageUrl="https://picsum.photos/300/300"
                    />
                ))}
            </div>
        </div>
    )
}

export default RecGroupList