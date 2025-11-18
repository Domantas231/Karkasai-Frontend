import { useState } from 'react';
import { Post } from '../shared/models';
import CommentComponent from './CommentComponent';

interface PostCardProps {
    post: Post,
    currentUserId?: number, // Pass the current logged-in user's ID
    onDeletePost?: (postId: number) => void,
    onEditPost?: (postId: number, newContent: string) => void,
    onDeleteComment?: (postId: number, commentId: number) => void,
    onEditComment?: (postId: number, commentId: number, newContent: string) => void
}

function PostCard({ 
    post, 
    currentUserId,
    onDeletePost,
    onEditPost,
    onDeleteComment,
    onEditComment 
}: PostCardProps) {
    const [showComments, setShowComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostContent, setEditedPostContent] = useState(post.content);

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

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            // TODO: Send comment to backend
            console.log('New comment:', newComment);
            setNewComment('');
        }
    };

    const handlePostEditSubmit = () => {
        if (editedPostContent.trim() && editedPostContent !== post.content) {
            onEditPost?.(post.id, editedPostContent);
        }
        setIsEditingPost(false);
    };

    const handlePostEditCancel = () => {
        setEditedPostContent(post.content);
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
    const isAuthor = currentUserId === post.author.id;

    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                {/* Post Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                        <img 
                            src={post.author.avatarUrl || 'https://picsum.photos/50/50'} 
                            className="rounded-circle me-3" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            alt={post.author.username}
                        />
                        <div>
                            <h5 className="mb-0">{post.author.username}</h5>
                            <small className="text-muted">{formatDate(post.createdAt)}</small>
                        </div>
                    </div>
                    
                    {isAuthor && !isEditingPost && (
                        <div className="btn-group">
                            <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setIsEditingPost(true)}
                                title="Redaguoti įrašą"
                            >
                                ✏️ Redaguoti
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={handlePostDelete}
                                title="Ištrinti įrašą"
                            >
                                🗑️ Ištrinti
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
                                className="btn btn-primary"
                                onClick={handlePostEditSubmit}
                            >
                                Išsaugoti
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={handlePostEditCancel}
                            >
                                Atšaukti
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="card-text mb-3">{post.content}</p>
                        
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
                            <div className="d-flex">
                                <input 
                                    type="text" 
                                    className="form-control me-2" 
                                    placeholder="Parašykite komentarą..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">
                                    Siųsti
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div>
                            {post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <CommentComponent 
                                        key={comment.id} 
                                        comment={comment}
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