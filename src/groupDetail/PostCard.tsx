import { useState } from 'react';
import { Post } from '../shared/models';
import CommentComponent from './CommentComponent.tsx';

interface PostCardProps {
    post: Post
}

function PostCard({ post }: PostCardProps) {
    const [showComments, setShowComments] = useState(true);
    const [newComment, setNewComment] = useState('');

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

    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                {/* Post Header */}
                <div className="d-flex align-items-center mb-3">
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

                {/* Post Content */}
                <p className="card-text mb-3">{post.content}</p>

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
                                    <CommentComponent key={comment.id} comment={comment} />
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