import { useState, useRef } from 'react';
import { Comment } from '../shared/models';
import appState from '../shared/appState';
import backend from '../shared/backend';
import config from '../shared/config';
import { notifySuccess, notifyFailure } from '../shared/notify';

interface CommentProps {
    groupId: number,
    postId: number,
    comment: Comment,
    currentUserId?: string, // Pass the current logged-in user's ID
    onDelete?: (commentId: number) => void,
    onEdit?: (commentId: number, newContent: string) => void,
    onCommentUpdated?: () => void
}

function CommentComponent({ groupId, postId, comment, currentUserId, onDelete, onEdit, onCommentUpdated }: CommentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [currentImageUrl, setCurrentImageUrl] = useState(comment.imageUrl);
    
    // Image editing state
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRemoveCurrentImage(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setRemoveCurrentImage(true);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleCancelImageChange = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setRemoveCurrentImage(false);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleEditSubmit = async () => {
        setIsUploading(true);
        
        try {
            // Update content if changed
            if (editedContent.trim() && editedContent !== comment.content) {
                onEdit?.(comment.id, editedContent);
            }

            // Handle image changes
            if (removeCurrentImage && currentImageUrl) {
                await backend.delete(`${config.backendUrl}groups/${groupId}/posts/${postId}/comments/${comment.id}/image`);
                setCurrentImageUrl('');
                notifySuccess('Komentaro nuotrauka pašalinta');
            }

            if (selectedImage) {
                const imageFormData = new FormData();
                imageFormData.append('Image', selectedImage);
                await backend.put(
                    `${config.backendUrl}groups/${groupId}/posts/${postId}/comments/${comment.id}/image`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setCurrentImageUrl(imagePreview || '');
                notifySuccess('Komentaro nuotrauka atnaujinta!');
            }

            setSelectedImage(null);
            setImagePreview(null);
            setRemoveCurrentImage(false);
            setIsEditing(false);
            
            // Refresh comments if callback provided
            onCommentUpdated?.();
        } catch (error) {
            console.error('Error updating comment:', error);
            notifyFailure('Nepavyko atnaujinti komentaro');
        } finally {
            setIsUploading(false);
        }
    };

    const handleEditCancel = () => {
        setEditedContent(comment.content);
        setSelectedImage(null);
        setImagePreview(null);
        setRemoveCurrentImage(false);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Ar tikrai norite ištrinti šį komentarą?')) {
            onDelete?.(comment.id);
        }
    };

    // Check if current user is the comment author
    const isAuthor = appState.userTitle === comment.user.userName;

    return (
        <div className="d-flex mb-3 align-items-start">
            <img 
                src={currentImageUrl !== null && currentImageUrl !== '' ? currentImageUrl : 'https://picsum.photos/40/40'}
                className="rounded-circle me-3" 
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                alt={comment.user.userName}
            />
            <div className="flex-grow-1">
                <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{comment.user.userName}</h6>
                        <div className="d-flex align-items-center">
                            <small className="text-muted me-2">{formatDate(comment.dateCreated)}</small>
                            {isAuthor && !isEditing && (
                                <div className="btn-group btn-group-sm">
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => setIsEditing(true)}
                                        title="Redaguoti"
                                    >
                                        <i className="bi bi-pencil"></i> Redaguoti
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger"
                                        onClick={handleDelete}
                                        title="Ištrinti"
                                    >
                                        <i className="bi bi-trash"></i> Ištrinti
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
                            
                            {/* Comment Image Edit Section */}
                            <div className="mb-2">
                                <label className="form-label small text-muted">Komentaro nuotrauka</label>
                                <div className="border rounded p-2" style={{ borderStyle: 'dashed', borderColor: '#4a5759' }}>
                                    {imagePreview ? (
                                        <div className="text-center">
                                            <img 
                                                src={imagePreview} 
                                                alt="New Preview" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={handleCancelImageChange}
                                                >
                                                    <i className="bi bi-x me-1"></i>
                                                    Atšaukti
                                                </button>
                                            </div>
                                        </div>
                                    ) : removeCurrentImage ? (
                                        <div className="text-center py-1">
                                            <p className="text-muted small mb-1">Nuotrauka bus pašalinta</p>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary btn-sm me-1"
                                                onClick={handleCancelImageChange}
                                            >
                                                Atšaukti
                                            </button>
                                            <label className="btn btn-outline-primary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-upload me-1"></i>
                                                Įkelti naują
                                                <input
                                                    type="file"
                                                    ref={imageInputRef}
                                                    className="d-none"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    ) : currentImageUrl ? (
                                        <div className="text-center">
                                            <img 
                                                src={currentImageUrl} 
                                                alt="Current" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                                            />
                                            <div className="d-flex justify-content-center gap-1">
                                                <label className="btn btn-outline-primary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Pakeisti
                                                    <input
                                                        type="file"
                                                        ref={imageInputRef}
                                                        className="d-none"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Pašalinti
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-1">
                                            <label className="btn btn-outline-secondary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-image me-1"></i>
                                                Pridėti nuotrauką
                                                <input
                                                    type="file"
                                                    ref={imageInputRef}
                                                    className="d-none"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-sm btn-success"
                                    onClick={handleEditSubmit}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            Saugoma...
                                        </>
                                    ) : (
                                        'Išsaugoti'
                                    )}
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={handleEditCancel}
                                    disabled={isUploading}
                                >
                                    Atšaukti
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="mb-0">{comment.content}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentComponent;