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
    onEditComment?: (postId: number, commentId: number, newContent: string) => void
}

function PostCard({
    groupId, 
    post, 
    currentUserId,
    updatePostComments,
    onDeletePost,
    onEditPost,
    onDeleteComment,
    onEditComment 
}: PostCardProps) {
    const [showComments, setShowComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostContent, setEditedPostContent] = useState(post.title);
    const [comments, setComments] = useState<Comment[]>([]);
    
    // Comment image upload state
    const [selectedCommentImage, setSelectedCommentImage] = useState<File | null>(null);
    const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const commentFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCommentData();
    }, []);

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

    const handlePostEditSubmit = () => {
        if (editedPostContent.trim() && editedPostContent !== post.title) {
            onEditPost?.(post.id, editedPostContent);
        }
        setIsEditingPost(false);
    };

    const handlePostEditCancel = () => {
        setEditedPostContent(post.title);
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
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-success"
                                onClick={handlePostEditSubmit}
                            >
                                Išsaugoti
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={handlePostEditCancel}
                            >
                                Atšaukti
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="card-text mb-3">{post.title}</p>
                        
                        {/* Post Image */}
                        {post.imageUrl && (
                            <div className="mb-3">
                                <img 
                                    src={post.imageUrl}
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
                                        comment={c}
                                        currentUserId={currentUserId}
                                        onDelete={handleCommentDelete}
                                        onEdit={handleCommentEdit}
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