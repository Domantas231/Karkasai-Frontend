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
                {groupsExample.map((g, index) => (
                    <RecGroup 
                        key={index}
                        groupName={g.groupName}
                        currMem={g.currMem}
                        maxMem={g.maxMem}
                        desc={g.desc}
                        tags={g.tags}
                        imageUrl={g.imageUrl}
                    />
                ))}
            </div>
        </div>
    )
}

export default RecGroupList