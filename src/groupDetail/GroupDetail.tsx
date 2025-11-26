import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderImage from '../shared/headerimage/headerImage';
import PostCard from './PostCard';
import NewPostForm from './NewPostForm';
import Tag from '../groups/Tag';
import { GroupDetail as GroupDetailType, GroupEditDetail, Post, Comment, TagOption, TagModel } from '../shared/models';
import config from '../shared/config';
import backend from '../shared/backend';

import { notifySuccess, notifyFailure } from '../shared/notify';

import appState from '../shared/appState';
import Select, { InputActionMeta, MultiValue, StylesConfig } from 'react-select';

function GroupDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<GroupDetailType | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isGroupOwner, setIsGroupOwner] = useState(true);
    
    const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
    const [tags, setTags] = useState<TagModel[]>()

    // Edit group state
    const [isEditingGroup, setIsEditingGroup] = useState(false);
    const [editedGroup, setEditedGroup] = useState<GroupEditDetail>({
        title: '',
        description: '',
        maxMembers: 0,
        tagIds: []
    });

    useEffect(() => {
        fetchGroupData();
        fetchTagData();
    }, [id]);

    const fetchTagData = async () => {
        try {
            console.log(config.backendUrl + 'group')
            const response = await backend.get<TagModel[]>(config.backendUrl + 'tags')
            setTags(response.data)
            console.log(response.data)
            }
        catch (error) {
            console.log('Failed to fetch data');
        }
    }

    const fetchGroupData = async () => {
        try {
            console.log(id)

            const groupResponse = await backend.get(`${config.backendUrl}groups/${id}`);
            const postsResponse = await backend.get(`${config.backendUrl}groups/${id}/posts`);
            
            console.log('group', groupResponse)
            console.log('posts', postsResponse)

            setGroup(groupResponse.data)
            setPosts(postsResponse.data)

            setIsGroupOwner(groupResponse.data.ownerUser.userName === appState.userTitle);
            
            // Initialize edit form with current group data
            setEditedGroup({
                title: groupResponse.data.title || '',
                description: groupResponse.data.description || '',
                maxMembers: groupResponse.data.maxMembers || 0,
                tagIds: groupResponse.data.tags.map((t: { id: number; }) => t.id) || []
            });
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    const handleUpdatePostComments = (postId: number, newComments: Comment[]) => {
        setPosts(posts.map(post => 
                post.id === postId ? { ...post, comments: newComments } : post
            ));
    }

    const handleDeletePost = async (postId: number) => {
        try {
            await backend.delete(`${config.backendUrl}groups/${id}/posts/${postId}`);
            
            console.log('Deleting post:', postId);
            setPosts(posts.filter(post => post.id !== postId));

            notifySuccess('Sėkmingai ištrintas įrašas')
        } catch (error) {
            console.error('Error deleting post:', error);
            notifyFailure('Nepavyko ištrinti įrašo');
        }
    };

    const handleEditPost = async (postId: number, newTitle: string) => {
        try {
            await backend.put(`${config.backendUrl}groups/${id}/posts/${postId}`, { title: newTitle });
            
            console.log('Editing post:', postId, newTitle);
            setPosts(posts.map(post => 
                post.id === postId ? { ...post, title: newTitle } : post
            ));

            notifySuccess('Sėkmingai paredaguotas įrašas')
        } catch (error) {
            console.error('Error editing post:', error);
            notifyFailure('Nepavyko redaguoti įrašo');
        }
    };

    const handleDeleteComment = async (postId: number, commentId: number) => {
        try {
            await backend.delete(`${config.backendUrl}groups/${id}/posts/${postId}/comments/${commentId}`);
            
            console.log('Deleting comment:', commentId, 'from post:', postId);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
                    : post
            ));

            notifySuccess('Sėkmingai ištrintas komentaras')
        } catch (error) {
            console.error('Error deleting comment:', error);
            notifyFailure('Nepavyko ištrinti komentaro');
        }
    };

    const handleEditComment = async (postId: number, commentId: number, newContent: string) => {
        try {
            await backend.put(`${config.backendUrl}groups/${id}/posts/${postId}/comments/${commentId}`, { content: newContent });
            
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

            notifySuccess('Sėkmingai paredaguotas komentaras')
        } catch (error) {
            console.error('Error editing comment:', error);
            notifyFailure('Nepavyko redaguoti komentaro');
        }
    };

    const handleDeleteGroup = async () => {
        if (window.confirm('Ar tikrai norite ištrinti šią grupę?')) {
            try {
                await backend.delete(`${config.backendUrl}groups/${id}`);

                notifySuccess('Grupė sėkmingai ištrinta')
                navigate('/groups');
            } catch (error) {
                console.error('Error deleting group:', error);
                notifyFailure('Nepavyko ištrinti grupės');
            }
        }
    };

    const handleEditGroupClick = () => {
        console.log("Group", group)

        setEditedGroup({
            title: group?.title || '',
            description: group?.description || '',
            maxMembers: group?.maxMembers || 0,
            tagIds: group?.tags.map(t => t.id) || []
        });
        setIsEditingGroup(true);
        console.log(group)
    };

    const handleEditGroupCancel = () => {
        setEditedGroup({
            title: group?.title || '',
            description: group?.description || '',
            maxMembers: group?.maxMembers || 0,
            tagIds: group?.tags.map(t => t.id) || []
        });

        setIsEditingGroup(false);
    };

    const handleEditGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setEditedGroup({
            ...editedGroup,
            tagIds: selectedTags.map(t => Number(t.value))
        })

        console.log(editedGroup)

        // Validation
        if (!editedGroup.title.trim()) {
            notifyFailure('Pavadinimas negali būti tuščias');
            return;
        }
        if (!editedGroup.description.trim()) {
            notifyFailure('Aprašymas negali būti tuščias');
            return;
        }
        if (editedGroup.maxMembers < (group?.currentMembers || 0)) {
            notifyFailure(`Narių skaičius negali būti mažesnis už dabartinį narių skaičių (${group?.currentMembers})`);
            return;
        }

        try {
            await backend.put(`${config.backendUrl}groups/${id}`, editedGroup);
            
            console.log('Updating group:', editedGroup);
            
            // Update local state
            if (group) {
                setGroup({
                    ...group,
                    title: editedGroup.title,
                    description: editedGroup.description,
                    maxMembers: editedGroup.maxMembers,
                    tags: editedGroup.tagIds.map(t => ({
                        id: t, 
                        name: tags?.filter(ti => ti.id === t)[0].name
                    } as TagModel))
                });
            }
            
            setIsEditingGroup(false);
            notifySuccess('Grupės informacija atnaujinta sėkmingai')
        } catch (error) {
            console.error('Error updating group:', error);
            notifyFailure('Nepavyko atnaujinti grupės informacijos')
        }
    };

    if (!group) {
        return (
            <div className="container py-5 text-center">
                <h3>Grupė nerasta</h3>
                <a href="/groups" className="btn btn-primary mt-3">Grįžti į grupes</a>
            </div>
        );
    }

    const customStyles: StylesConfig<TagOption> = {
            control: (provided, state) => ({
                ...provided,
                backgroundColor: '#212529',
                borderColor: state.isFocused ? '#4299e1' : '#4a5759',
                color: 'white',
                '&:hover': {
                    borderColor: '#4299e1'
                },
                minHeight: '45px'
            }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: '#212529',
            }),
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#4299e1' : state.isFocused ? '#4a5759' : '#212529',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#4a5759'
                }
            }),
            multiValue: (provided) => ({
                ...provided,
                backgroundColor: '#4a5759',
            }),
            multiValueLabel: (provided) => ({
                ...provided,
                color: 'white',
            }),
            multiValueRemove: (provided) => ({
                ...provided,
                color: 'white',
                '&:hover': {
                    backgroundColor: '#e53e3e',
                    color: 'white',
                }
            }),
            input: (provided) => ({
                ...provided,
                color: 'white',
            }),
            placeholder: (provided) => ({
                ...provided,
                color: '#a0aec0',
            }),
            singleValue: (provided) => ({
                ...provided,
                color: 'white',
            })
        }

    const options = tags?.map(t => ({value: t.id, label: t.name}))

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

                                            <div className="mb-3 my-3">
                                                <label className="form-label fw-semibold">
                                                    Žymos
                                                </label>
                                                <Select<TagOption, true>
                                                    options={options}
                                                    value={editedGroup.tagIds.map(t => ({
                                                        value: t, 
                                                        label: tags?.filter(ti => ti.id === t)[0].name
                                                    } as TagOption))}
                                                    onChange={(selected : MultiValue<TagOption>) => setEditedGroup({
                                                        ...editedGroup,
                                                        tagIds: selected ? selected.map(s => Number(s.value)) : []
                                                    })}
                                                    classNamePrefix="select"
                                                    className="basic-multi-select"
                                                    isMulti
                                                    name="tags"
                                                    styles={customStyles}
                                                    placeholder="Pasirinkite žymas..."   
                                                />
                                                <div className="form-text">
                                                    Pasirinkite žymas, kurios apibūdina jūsų grupę
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 justify-content-end">
                                            <button 
                                                type="submit"
                                                className="btn btn-success"
                                            >
                                                Išsaugoti
                                            </button>
                                            <button 
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={handleEditGroupCancel}
                                            >
                                                Atšaukti
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
                                                    <div className="btn-group">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={handleEditGroupClick}
                                                            title="Redaguoti grupę"
                                                        >
                                                            Redaguoti
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={handleDeleteGroup}
                                                            title="Ištrinti grupę"
                                                        >
                                                            Ištrinti
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mb-3">{group.description}</p>
                                        <div className="mb-3 d-flex justify-content-center">
                                            {group.tags.map((tag) => (
                                                <Tag key={tag.id} name={tag.name} />
                                            ))}
                                        </div>
                                        <div className="text-muted text-center">
                                            <small>Sukūrė: {group.ownerUser.userName}</small>
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
                            posts.toReversed().map(post => (
                                <PostCard 
                                    groupId={Number(id)}
                                    key={post.id} 
                                    post={post}
                                    updatePostComments={handleUpdatePostComments}
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