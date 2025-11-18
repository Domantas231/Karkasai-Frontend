import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderImage from '../shared/headerimage/headerImage';
import PostCard from './PostCard';
import NewPostForm from './NewPostForm';
import Tag from '../groups/Tag';
import { GroupDetail as GroupDetailType, Post } from '../shared/models';
import config from '../shared/config';
import backend from '../shared/backend';

function GroupDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<GroupDetailType | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | undefined>(1); // TODO: Get from auth context
    const [isGroupOwner, setIsGroupOwner] = useState(false);
    
    // Edit group state
    const [isEditingGroup, setIsEditingGroup] = useState(false);
    const [editedGroup, setEditedGroup] = useState({
        title: '',
        description: '',
        maxMembers: 0,
        tags: ''
    });

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
                    imageUrl: "https://picsum.photos/800/400?random=10",
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
            setIsGroupOwner(mockGroup.createdBy.id === currentUserId);
            
            // Initialize edit form with current group data
            setEditedGroup({
                title: mockGroup.title,
                description: mockGroup.description,
                maxMembers: mockGroup.maxMembers,
                tags: mockGroup.tags
            });
        } catch (error) {
            console.error('Error fetching group data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        try {
            // TODO: Send delete request to backend
            // await backend.delete(`${config.backendUrl}group/${id}/post/${postId}`);
            
            console.log('Deleting post:', postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Nepavyko ištrinti įrašo');
        }
    };

    const handleEditPost = async (postId: number, newContent: string) => {
        try {
            // TODO: Send update request to backend
            // await backend.put(`${config.backendUrl}group/${id}/post/${postId}`, { content: newContent });
            
            console.log('Editing post:', postId, newContent);
            setPosts(posts.map(post => 
                post.id === postId ? { ...post, content: newContent } : post
            ));
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Nepavyko redaguoti įrašo');
        }
    };

    const handleDeleteComment = async (postId: number, commentId: number) => {
        try {
            // TODO: Send delete request to backend
            // await backend.delete(`${config.backendUrl}group/${id}/post/${postId}/comment/${commentId}`);
            
            console.log('Deleting comment:', commentId, 'from post:', postId);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
                    : post
            ));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Nepavyko ištrinti komentaro');
        }
    };

    const handleEditComment = async (postId: number, commentId: number, newContent: string) => {
        try {
            // TODO: Send update request to backend
            // await backend.put(`${config.backendUrl}group/${id}/post/${postId}/comment/${commentId}`, { content: newContent });
            
            console.log('Editing comment:', commentId, 'from post:', postId, newContent);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? {
                        ...post,
                        comments: post.comments.map(comment =>
                            comment.id === commentId ? { ...comment, content: newContent } : comment
                        )
                    }
                    : post
            ));
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Nepavyko redaguoti komentaro');
        }
    };

    const handleDeleteGroup = async () => {
        if (window.confirm('Ar tikrai norite ištrinti šią grupę? Šis veiksmas negrįžtamas.')) {
            try {
                // TODO: Send delete request to backend
                // await backend.delete(`${config.backendUrl}group/${id}`);
                
                console.log('Deleting group:', id);
                alert('Grupė ištrinta sėkmingai');
                navigate('/groups');
            } catch (error) {
                console.error('Error deleting group:', error);
                alert('Nepavyko ištrinti grupės');
            }
        }
    };

    const handleEditGroupClick = () => {
        setEditedGroup({
            title: group?.title || '',
            description: group?.description || '',
            maxMembers: group?.maxMembers || 0,
            tags: group?.tags || ''
        });
        setIsEditingGroup(true);
    };

    const handleEditGroupCancel = () => {
        setEditedGroup({
            title: group?.title || '',
            description: group?.description || '',
            maxMembers: group?.maxMembers || 0,
            tags: group?.tags || ''
        });
        setIsEditingGroup(false);
    };

    const handleEditGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!editedGroup.title.trim()) {
            alert('Pavadinimas negali būti tuščias');
            return;
        }
        if (!editedGroup.description.trim()) {
            alert('Aprašymas negali būti tuščias');
            return;
        }
        if (editedGroup.maxMembers < (group?.currentMembers || 0)) {
            alert(`Narių skaičius negali būti mažesnis už dabartinį narių skaičių (${group?.currentMembers})`);
            return;
        }

        try {
            // TODO: Send update request to backend
            // await backend.put(`${config.backendUrl}group/${id}`, editedGroup);
            
            console.log('Updating group:', editedGroup);
            
            // Update local state
            if (group) {
                setGroup({
                    ...group,
                    title: editedGroup.title,
                    description: editedGroup.description,
                    maxMembers: editedGroup.maxMembers,
                    tags: editedGroup.tags
                });
            }
            
            setIsEditingGroup(false);
            alert('Grupės informacija atnaujinta sėkmingai');
        } catch (error) {
            console.error('Error updating group:', error);
            alert('Nepavyko atnaujinti grupės informacijos');
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
                                {isEditingGroup ? (
                                    /* Edit Group Form */
                                    <form onSubmit={handleEditGroupSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="groupTitle" className="form-label">
                                                Pavadinimas
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="groupTitle"
                                                value={editedGroup.title}
                                                onChange={(e) => setEditedGroup({
                                                    ...editedGroup,
                                                    title: e.target.value
                                                })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="groupDescription" className="form-label">
                                                Aprašymas
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="groupDescription"
                                                rows={4}
                                                value={editedGroup.description}
                                                onChange={(e) => setEditedGroup({
                                                    ...editedGroup,
                                                    description: e.target.value
                                                })}
                                                required
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="maxMembers" className="form-label">
                                                    Maksimalus narių skaičius
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="maxMembers"
                                                    min={group.currentMembers}
                                                    value={editedGroup.maxMembers}
                                                    onChange={(e) => setEditedGroup({
                                                        ...editedGroup,
                                                        maxMembers: parseInt(e.target.value) || 0
                                                    })}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    Dabartinis narių skaičius: {group.currentMembers}
                                                </small>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="groupTags" className="form-label">
                                                    Žymos (atskirtos kableliais)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="groupTags"
                                                    value={editedGroup.tags}
                                                    onChange={(e) => setEditedGroup({
                                                        ...editedGroup,
                                                        tags: e.target.value
                                                    })}
                                                    placeholder="pvz: naujokams, pažengusiems"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 justify-content-end">
                                            <button 
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleEditGroupCancel}
                                            >
                                                Atšaukti
                                            </button>
                                            <button 
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Išsaugoti pakeitimus
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* Group Info Display */
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="mb-0">Apie grupę</h4>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-primary rounded-pill">
                                                    {group.currentMembers} / {group.maxMembers} nariai
                                                </span>
                                                {isGroupOwner && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={handleEditGroupClick}
                                                            title="Redaguoti grupę"
                                                        >
                                                            ✏️ Redaguoti
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={handleDeleteGroup}
                                                            title="Ištrinti grupę"
                                                        >
                                                            🗑️ Ištrinti
                                                        </button>
                                                    </>
                                                )}
                                            </div>
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
                                    </>
                                )}
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
                                <PostCard 
                                    key={post.id} 
                                    post={post}
                                    currentUserId={currentUserId}
                                    onDeletePost={handleDeletePost}
                                    onEditPost={handleEditPost}
                                    onDeleteComment={handleDeleteComment}
                                    onEditComment={handleEditComment}
                                />
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