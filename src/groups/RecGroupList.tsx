import RecGroup from "./RecGroup";

function RecGroupList(){
    let groupsExample = [
        {
            groupName: "Bėgiojimas",
            currMem: 5,
            maxMem: 7,
            desc: "Bėgiojam rytais 9:00 prie mergelių tilto į panemunės šilą!",
            tags: ['patyrusiem', 'naujokam', 'turneriai'],
            imageUrl: "https://picsum.photos/300/300"
        },
        {
            groupName: "Sveikas maitinimasis",
            currMem: 3,
            maxMem: 4,
            desc: "Kiekvieną dieną keliame receptus ir dalinamies savais sunkumais.",
            tags: ['Virs 60m', 'kaunas', 'centras'],
            imageUrl: "https://picsum.photos/300/300"
        },
        {
            groupName: "Knygų skaitymas",
            currMem: 10,
            maxMem: 12,
            desc: "Pasikalbam apie knygas ir dalinamies rekomendacijomis! Prie to pačio susitinkam sekmadieniais.",
            tags: ['ketvirtas', 'astuntas', 'devintas'],
            imageUrl: "https://picsum.photos/300/300"
        }
    ]

    return (
        <div className="container">
            <div className="row d-flex text-center py-5" style={{"textShadow": "2px 2px 4px black"}}>
                <h4>Rekomenduojamos grupės</h4>
            </div>

            <div className="row mb-3 d-flex align-items-end justify-content-around">
                {groupsExample.map(g => <RecGroup {... g} />)}
            </div>
        </div>
    )
}

export default RecGroupList