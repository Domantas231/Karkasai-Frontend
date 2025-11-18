import Tag from "./Tag"

interface RecGroupProps {
    groupName: string,
    currMem: number,
    maxMem: number,
    desc: string,
    tags: Array<string>,
    imageUrl: string
}

function RecGroup({groupName, currMem, maxMem, desc, tags, imageUrl} : RecGroupProps) {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-lg rec-group-card" style={{
                transition: 'all 0.3s ease',
                overflow: 'hidden'
            }}>
                {/* Image with overlay */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img 
                        src={imageUrl} 
                        className="card-img-top"
                        style={{
                            height: '220px',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '1rem'
                    }}>
                        <h5 className="text-white mb-0 fw-bold" style={{
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontSize: '1.3rem'
                        }}>
                            {groupName}
                        </h5>
                    </div>
                    
                    {/* Availability badge */}
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: currMem >= maxMem ? 'rgba(220, 53, 69, 0.95)' : 'rgba(25, 135, 84, 0.95)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {currMem >= maxMem ? 'Pilna' : `${maxMem - currMem} vietos liko`}
                    </div>
                </div>

                <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                    {/* Description */}
                    <p className="card-text text-muted flex-grow-1" style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6'
                    }}>
                        {desc}
                    </p>

                    {/* Tags */}
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {tags.map((t, index) => (
                            <span 
                                key={index}
                                style={{
                                    background: 'blue',
                                    color: 'white',
                                    padding: '0.35rem 0.9rem',
                                    borderRadius: '15px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    boxShadow: '0 2px 5px rgba(102, 126, 234, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(102, 126, 234, 0.3)';
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Join button */}
                    <button 
                        className="btn btn-primary w-100 fw-bold"
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
                        disabled={currMem >= maxMem}
                    >
                        {currMem >= maxMem ? 'Grupė pilna' : 'Prisijungti dabar'}
                    </button>
                </div>
            </div>

            <style>{`
                .rec-group-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
                }
            `}</style>
        </div>
    )
}

export default RecGroup