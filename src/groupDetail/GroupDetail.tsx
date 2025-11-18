import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderImage from '../shared/headerimage/headerImage';
import PostCard from './PostCard';
import NewPostForm from './NewPostForm';
import Tag from '../groups/Tag';
import { GroupDetail as GroupDetailType, Post } from '../shared/models';
import config from '../shared/config';
import backend from '../shared/backend';

function GroupDetail() {
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<GroupDetailType | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const fetchGroupData = async () => {
        try {
            // TODO: Replace with actual API calls
            // const groupResponse = await backend.get(`${config.backendUrl}group/${id}`);
            // const postsResponse = await backend.get(`${config.backendUrl}group/${id}/posts`);
            
            // Mock data for demonstration
            const mockGroup: GroupDetailType = {
                id: Number(id),
                title: "Bėgiojimas vakarais",
                description: "Bėgiojam vakarais 20:00 prie mergelių tilto į panemunės šilą! Sveiki atvykę į mūsų bėgimo grupę. Čia dalinamės patarimais, motyvuojame vieni kitus ir planuojame treniruotes.",
                currentMembers: 3,
                maxMembers: 5,
                tags: 'patyrusiem, naujokam',
                imageUrl: "https://picsum.photos/1200/400",
                createdBy: {
                    id: 1,
                    username: "Jonas Jonaitis"
                },
                createdAt: "2024-01-15T10:00:00Z"
            };

            const mockPosts: Post[] = [
                {
                    id: 1,
                    content: "Sveiki visi! Šiandien pasiekiau asmeninį rekordą - nubėgau 10 km per 50 minučių! 🏃‍♂️ Esu labai laimingas ir noriu padėkoti šiai grupei už motyvaciją!",
                    author: {
                        id: 2,
                        username: "Petras Petraitis",
                        avatarUrl: "https://picsum.photos/50/50?random=1"
                    },
                    createdAt: "2024-11-17T19:30:00Z",
                    likes: 12,
                    comments: [
                        {
                            id: 1,
                            content: "Sveikinu! Tai puikus rezultatas! 🎉",
                            author: {
                                id: 3,
                                username: "Ona Onaitė",
                                avatarUrl: "https://picsum.photos/50/50?random=2"
                            },
                            createdAt: "2024-11-17T19:45:00Z",
                            likes: 3
                        },
                        {
                            id: 2,
                            content: "Wow! Kaip tau pavyko taip greitai pagerinti rezultatus?",
                            author: {
                                id: 4,
                                username: "Antanas Antanaitis",
                                avatarUrl: "https://picsum.photos/50/50?random=3"
                            },
                            createdAt: "2024-11-17T20:00:00Z",
                            likes: 1
                        }
                    ]
                },
                {
                    id: 2,
                    content: "Rytoj planuoju treniruotę 7:00 ryto. Kas prisijungs? Marsrutas: Nemuno sala, apie 5km.",
                    author: {
                        id: 1,
                        username: "Jonas Jonaitis",
                        avatarUrl: "https://picsum.photos/50/50?random=4"
                    },
                    createdAt: "2024-11-17T18:00:00Z",
                    likes: 8,
                    comments: [
                        {
                            id: 3,
                            content: "Aš dalyvausiu! 👍",
                            author: {
                                id: 2,
                                username: "Petras Petraitis",
                                avatarUrl: "https://picsum.photos/50/50?random=1"
                            },
                            createdAt: "2024-11-17T18:15:00Z",
                            likes: 2
                        },
                        {
                            id: 4,
                            content: "Man per anksti, bet kitą kartą tikrai prisijungsiu!",
                            author: {
                                id: 5,
                                username: "Greta Gretaitė",
                                avatarUrl: "https://picsum.photos/50/50?random=5"
                            },
                            createdAt: "2024-11-17T18:30:00Z",
                            likes: 1
                        }
                    ]
                },
                {
                    id: 3,
                    content: "Koks jūsų patariamas bėgimo batų modelis? Ieškau naujų ir nesu tikras ką rinktis. 👟",
                    author: {
                        id: 6,
                        username: "Tomas Tomaitis",
                        avatarUrl: "https://picsum.photos/50/50?random=6"
                    },
                    createdAt: "2024-11-17T15:00:00Z",
                    likes: 5,
                    comments: []
                }
            ];

            setGroup(mockGroup);
            setPosts(mockPosts);
        } catch (error) {
            console.error('Error fetching group data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Kraunama...</span>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="container py-5 text-center">
                <h3>Grupė nerasta</h3>
                <a href="/groups" className="btn btn-primary mt-3">Grįžti į grupes</a>
            </div>
        );
    }

    return (
        <>
            <HeaderImage 
                title={group.title} 
                subtitle={group.description}
                imgHeight="400px"
            />

            <div className="container py-3">
                {/* Group Info Section */}
                <div className="row mb-4">
                    <h4 className="display-5 mb-4 text-center">Aprašymas</h4>
                    <div className="col-md-12">
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">Apie grupę</h4>
                                    <span className="badge bg-primary rounded-pill">
                                        {group.currentMembers} / {group.maxMembers} nariai
                                    </span>
                                </div>
                                <p className="mb-3">{group.description}</p>
                                <div className="mb-3 d-flex justify-content-center">
                                    {group.tags.split(',').map((tag, index) => (
                                        <Tag key={index} name={tag.trim()} />
                                    ))}
                                </div>
                                <div className="text-muted text-center">
                                    <small>Sukūrė: {group.createdBy.username}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="row">
                    <div className="col-md-12">
                        <h4 className="display-5 mb-4 text-center">Įrašai</h4>
                        
                        <NewPostForm groupId={group.id} onPostCreated={fetchGroupData} />
                        
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="card shadow">
                                <div className="card-body text-center py-5">
                                    <p className="text-muted">Grupėje dar nėra jokių įrašų.</p>
                                    <p className="text-muted">Būkite pirmas ir pasidalinkite kažkuo!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GroupDetail;