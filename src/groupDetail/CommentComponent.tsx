import { Comment } from '../shared/models';

interface CommentProps {
    comment: Comment
}

function CommentComponent({ comment }: CommentProps) {
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

    return (
        <div className="d-flex mb-3 align-items-center">
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
                        <small className="text-muted">{formatDate(comment.createdAt)}</small>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                </div>
            </div>
        </div>
    );
}

export default CommentComponent;