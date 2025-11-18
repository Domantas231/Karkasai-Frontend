import { useState } from 'react';
import { Comment } from '../shared/models';

interface CommentProps {
    comment: Comment,
    currentUserId?: number, // Pass the current logged-in user's ID
    onDelete?: (commentId: number) => void,
    onEdit?: (commentId: number, newContent: string) => void
}

function CommentComponent({ comment, currentUserId, onDelete, onEdit }: CommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const handleEditSubmit = () => {
        if (editedContent.trim() && editedContent !== comment.content) {
            onEdit?.(comment.id, editedContent);
        }
        setIsEditing(false);
    };

    const handleEditCancel = () => {
        setEditedContent(comment.content);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Ar tikrai norite ištrinti šį komentarą?')) {
            onDelete?.(comment.id);
        }
    };

    // Check if current user is the comment author
    const isAuthor = currentUserId === comment.author.id;

    return (
        <div className="d-flex mb-3 align-items-start">
            <img 
                src={comment.author.avatarUrl || 'https://picsum.photos/40/40'} 
                className="rounded-circle me-3" 
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                alt={comment.author.username}
            />
            <div className="flex-grow-1">
                <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{comment.author.username}</h6>
                        <div className="d-flex align-items-center">
                            <small className="text-muted me-2">{formatDate(comment.createdAt)}</small>
                            {isAuthor && !isEditing && (
                                <div className="btn-group btn-group-sm">
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => setIsEditing(true)}
                                        title="Redaguoti"
                                    >
                                        <i className="bi bi-pencil"></i> ✏️
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger"
                                        onClick={handleDelete}
                                        title="Ištrinti"
                                    >
                                        <i className="bi bi-trash"></i> 🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <div>
                            <textarea 
                                className="form-control mb-2" 
                                rows={3}
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={handleEditSubmit}
                                >
                                    Išsaugoti
                                </button>
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={handleEditCancel}
                                >
                                    Atšaukti
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mb-0">{comment.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentComponent;