import { useState, useRef } from 'react';
import backend from '../shared/backend';
import config from '../shared/config';

import { notifySuccess, notifyFailure } from '../shared/notify';

interface NewPostFormProps {
    groupId: number,
    onPostCreated?: () => void
}

function NewPostForm({ groupId, onPostCreated }: NewPostFormProps) {
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // First create the post
            const response = await backend.post(`${config.backendUrl}groups/${groupId}/posts`, {title: content});
            const createdPostId = response.data.id;

            // If image is selected, upload it
            if (selectedImage && createdPostId) {
                const imageFormData = new FormData();
                imageFormData.append('Image', selectedImage);
                
                await backend.put(
                    `${config.backendUrl}groups/${groupId}/posts/${createdPostId}/image`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }
            
            // Reset form
            setContent('');
            setSelectedImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            notifySuccess('Įrašas sėkmingai sukurtas!');
            
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            notifyFailure('Nepavyko sukurti įrašo');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-body">
                <h5 className="card-title mb-3">Sukurti naują įrašą</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <textarea 
                            className="form-control" 
                            rows={4}
                            placeholder="Pasidalinkite savo mintimis su grupe..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-3">
                        {imagePreview ? (
                            <div className="position-relative d-inline-block">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                    onClick={handleRemoveImage}
                                    title="Pašalinti nuotrauką"
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <label className="btn btn-outline-secondary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                                    <i className="bi bi-image me-1"></i>
                                    Pridėti nuotrauką
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="d-none"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                <small className="text-muted">JPG, PNG, WebP (maks. 5MB)</small>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-end">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Skelbiama...
                                </>
                            ) : (
                                'Paskelbti'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewPostForm;