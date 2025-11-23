import { useState } from 'react';
import backend from '../shared/backend';
import config from '../shared/config';

interface NewPostFormProps {
    groupId: number,
    onPostCreated?: () => void
}

function NewPostForm({ groupId, onPostCreated }: NewPostFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await backend.post(`${config.backendUrl}groups/${groupId}/posts`, {title: content});
            
            setContent('');
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error('Error creating post:', error);
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
                            disabled={isSubmitting}
                            required
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? 'Siunčiama...' : 'Paskelbti'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewPostForm;