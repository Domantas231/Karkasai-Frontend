import { useState, useEffect, useRef } from 'react';
import { Post, Comment } from '../shared/models';
import CommentComponent from './CommentComponent';
import backend from '../shared/backend';
import config from '../shared/config';
import appState from '../shared/appState';
import { notifySuccess, notifyFailure } from '../shared/notify';

interface PostCardProps {
    groupId: number,
    post: Post,
    currentUserId?: string, // Pass the current logged-in user's ID
    updatePostComments?: (postId: number, newComments: Comment[]) => void,
    onDeletePost?: (postId: number) => void,
    onEditPost?: (postId: number, newContent: string) => void,
    onDeleteComment?: (postId: number, commentId: number) => void,
    onEditComment?: (postId: number, commentId: number, newContent: string) => void,
    onPostUpdated?: () => void
}

function PostCard({
    groupId, 
    post, 
    currentUserId,
    updatePostComments,
    onDeletePost,
    onEditPost,
    onDeleteComment,
    onEditComment,
    onPostUpdated
}: PostCardProps) {
    const [showComments, setShowComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostContent, setEditedPostContent] = useState(post.title);
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentPostImageUrl, setCurrentPostImageUrl] = useState(post.imageUrl);
    
    // Comment image upload state
    const [selectedCommentImage, setSelectedCommentImage] = useState<File | null>(null);
    const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const commentFileInputRef = useRef<HTMLInputElement>(null);

    // Post image edit state
    const [selectedPostImage, setSelectedPostImage] = useState<File | null>(null);
    const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
    const [removeCurrentPostImage, setRemoveCurrentPostImage] = useState(false);
    const [isUploadingPostImage, setIsUploadingPostImage] = useState(false);
    const postImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCommentData();
    }, []);

    useEffect(() => {
        setCurrentPostImageUrl(post.imageUrl);
    }, [post.imageUrl]);

    const fetchCommentData = async () => {
        try {
            const commentsResponse = await backend.get(`${config.backendUrl}groups/${groupId}/posts/${post.id}/comments`);
            console.log(commentsResponse)

            updatePostComments?.(post.id, commentsResponse.data as Comment[])
        }
        catch (error) {
            console.error('Error fetching group data:', error);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('lt-LT', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCommentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                notifyFailure('Netinkamas failo tipas. Leidžiami: JPG, PNG, WebP');
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                notifyFailure('Failas per didelis. Maksimalus dydis: 5MB');
                return;
            }
            setSelectedCommentImage(file);
            setCommentImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveCommentImage = () => {
        setSelectedCommentImage(null);
        setCommentImagePreview(null);
        if (commentFileInputRef.current) {
            commentFileInputRef.current.value = '';
        }
    };

    // Post image handlers
    const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                notifyFailure('Netinkamas failo tipas. Leidžiami: JPG, PNG, WebP');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                notifyFailure('Failas per didelis. Maksimalus dydis: 5MB');
                return;
            }
            setSelectedPostImage(file);
            setPostImagePreview(URL.createObjectURL(file));
            setRemoveCurrentPostImage(false);
        }
    };

    const handleRemovePostImage = () => {
        setSelectedPostImage(null);
        setPostImagePreview(null);
        setRemoveCurrentPostImage(true);
        if (postImageInputRef.current) {
            postImageInputRef.current.value = '';
        }
    };

    const handleCancelPostImageChange = () => {
        setSelectedPostImage(null);
        setPostImagePreview(null);
        setRemoveCurrentPostImage(false);
        if (postImageInputRef.current) {
            postImageInputRef.current.value = '';
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) {
            return;
        }

        setIsSubmittingComment(true);

        try {
            // First create the comment
            const response = await backend.post(`${config.backendUrl}groups/${groupId}/posts/${post.id}/comments`, {content: newComment});
            const createdCommentId = response.data.id;

            // If image is selected, upload it
            if (selectedCommentImage && createdCommentId) {
                const imageFormData = new FormData();
                imageFormData.append('Image', selectedCommentImage);
                
                await backend.put(
                    `${config.backendUrl}groups/${groupId}/posts/${post.id}/comments/${createdCommentId}/image`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            // Reset form
            setNewComment('');
            setSelectedCommentImage(null);
            setCommentImagePreview(null);
            if (commentFileInputRef.current) {
                commentFileInputRef.current.value = '';
            }

            notifySuccess('Komentaras sėkmingai pridėtas!');
            fetchCommentData();
        }
        catch (error) {
            console.log(error);
            notifyFailure('Nepavyko pridėti komentaro');
        }
        finally {
            setIsSubmittingComment(false);
        }
    };

    const handlePostEditSubmit = async () => {
        setIsUploadingPostImage(true);
        
        try {
            // Update post content if changed
            if (editedPostContent.trim() && editedPostContent !== post.title) {
                onEditPost?.(post.id, editedPostContent);
            }

            // Handle image changes
            if (removeCurrentPostImage && currentPostImageUrl) {
                await backend.delete(`${config.backendUrl}groups/${groupId}/posts/${post.id}/image`);
                setCurrentPostImageUrl('');
            }

            if (selectedPostImage) {
                const imageFormData = new FormData();
                imageFormData.append('Image', selectedPostImage);
                await backend.put(
                    `${config.backendUrl}groups/${groupId}/posts/${post.id}/image`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                // Update the local image URL with the preview for immediate feedback
                setCurrentPostImageUrl(postImagePreview || '');
                notifySuccess('Įrašo nuotrauka atnaujinta!');
            }

            setSelectedPostImage(null);
            setPostImagePreview(null);
            setRemoveCurrentPostImage(false);
            setIsEditingPost(false);
            
            // Refresh data if callback provided
            onPostUpdated?.();
        } catch (error) {
            console.error('Error updating post:', error);
            notifyFailure('Nepavyko atnaujinti įrašo');
        } finally {
            setIsUploadingPostImage(false);
        }
    };

    const handlePostEditCancel = () => {
        setEditedPostContent(post.title);
        setSelectedPostImage(null);
        setPostImagePreview(null);
        setRemoveCurrentPostImage(false);
        setIsEditingPost(false);
    };

    const handlePostDelete = () => {
        if (window.confirm('Ar tikrai norite ištrinti šį įrašą?')) {
            onDeletePost?.(post.id);
        }
    };

    const handleCommentDelete = (commentId: number) => {
        onDeleteComment?.(post.id, commentId);
    };

    const handleCommentEdit = (commentId: number, newContent: string) => {
        onEditComment?.(post.id, commentId, newContent);
    };

    // Check if current user is the post author
    const isAuthor = appState.userTitle === post.user.userName;

    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                {/* Post Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                        <div>
                            <h5 className="mb-0">{post.user.userName}</h5>
                            <small className="text-muted">{formatDate(post.dateCreated)}</small>
                        </div>
                    </div>
                    
                    {isAuthor && !isEditingPost && (
                        <div className="btn-group">
                            <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setIsEditingPost(true)}
                                title="Redaguoti įrašą"
                            >
                                Redaguoti
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={handlePostDelete}
                                title="Ištrinti įrašą"
                            >
                                Ištrinti
                            </button>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                {isEditingPost ? (
                    <div className="mb-3">
                        <textarea 
                            className="form-control mb-2" 
                            rows={4}
                            value={editedPostContent}
                            onChange={(e) => setEditedPostContent(e.target.value)}
                        />
                        
                        {/* Post Image Edit Section */}
                        <div className="mb-3">
                            <label className="form-label small text-muted">Įrašo nuotrauka</label>
                            <div className="border rounded p-3" style={{ borderStyle: 'dashed', borderColor: '#4a5759' }}>
                                {postImagePreview ? (
                                    <div className="text-center">
                                        <img 
                                            src={postImagePreview} 
                                            alt="New Preview" 
                                            className="img-fluid rounded mb-2"
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleCancelPostImageChange}
                                            >
                                                <i className="bi bi-x me-1"></i>
                                                Atšaukti pakeitimą
                                            </button>
                                        </div>
                                    </div>
                                ) : removeCurrentPostImage ? (
                                    <div className="text-center py-2">
                                        <p className="text-muted small mb-2">Nuotrauka bus pašalinta</p>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary btn-sm me-2"
                                            onClick={handleCancelPostImageChange}
                                        >
                                            Atšaukti
                                        </button>
                                        <label className="btn btn-outline-primary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                            <i className="bi bi-upload me-1"></i>
                                            Įkelti naują
                                            <input
                                                type="file"
                                                ref={postImageInputRef}
                                                className="d-none"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handlePostImageChange}
                                            />
                                        </label>
                                    </div>
                                ) : currentPostImageUrl ? (
                                    <div className="text-center">
                                        <img 
                                            src={currentPostImageUrl} 
                                            alt="Current" 
                                            className="img-fluid rounded mb-2"
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="d-flex justify-content-center gap-2">
                                            <label className="btn btn-outline-primary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-pencil me-1"></i>
                                                Pakeisti
                                                <input
                                                    type="file"
                                                    ref={postImageInputRef}
                                                    className="d-none"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handlePostImageChange}
                                                />
                                            </label>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleRemovePostImage}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Pašalinti
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <label className="btn btn-outline-secondary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                            <i className="bi bi-image me-1"></i>
                                            Pridėti nuotrauką
                                            <input
                                                type="file"
                                                ref={postImageInputRef}
                                                className="d-none"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handlePostImageChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-success"
                                onClick={handlePostEditSubmit}
                                disabled={isUploadingPostImage}
                            >
                                {isUploadingPostImage ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Saugoma...
                                    </>
                                ) : (
                                    'Išsaugoti'
                                )}
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={handlePostEditCancel}
                                disabled={isUploadingPostImage}
                            >
                                Atšaukti
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="card-text mb-3">{post.title}</p>
                        
                        {/* Post Image */}
                        {currentPostImageUrl && (
                            <div className="mb-3">
                                <img 
                                    src={currentPostImageUrl}
                                    className="img-fluid rounded" 
                                    alt="Post attachment"
                                    style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4">
                        
                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <div className="mb-2">
                                <div className="d-flex">
                                    <input 
                                        type="text" 
                                        className="form-control me-2" 
                                        placeholder="Parašykite komentarą..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={isSubmittingComment}
                                    >
                                        {isSubmittingComment ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            'Siųsti'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Comment Image Upload */}
                            <div className="d-flex align-items-center gap-2">
                                {commentImagePreview ? (
                                    <div className="position-relative d-inline-block">
                                        <img 
                                            src={commentImagePreview} 
                                            alt="Preview" 
                                            className="rounded"
                                            style={{ maxHeight: '100px', objectFit: 'cover' }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                            onClick={handleRemoveCommentImage}
                                            title="Pašalinti nuotrauką"
                                            style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="btn btn-outline-secondary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-image me-1"></i>
                                        Nuotrauka
                                        <input
                                            type="file"
                                            ref={commentFileInputRef}
                                            className="d-none"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleCommentImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </form>

                        {/* Comments List */}
                        <div>
                            {post.comments?.length > 0 ? (
                                post.comments.toReversed().map(c => (
                                    <CommentComponent 
                                        key={c.id} 
                                        groupId={groupId}
                                        postId={post.id}
                                        comment={c}
                                        currentUserId={currentUserId}
                                        onDelete={handleCommentDelete}
                                        onEdit={handleCommentEdit}
                                        onCommentUpdated={fetchCommentData}
                                    />
                                ))
                            ) : (
                                <p className="text-muted text-center">Komentarų dar nėra. Būkite pirmas!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;