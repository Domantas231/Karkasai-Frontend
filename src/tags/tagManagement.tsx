import { useState, useEffect } from 'react';
import HeaderImage from '../shared/headerimage/headerImage';
import backend from '../shared/backend';
import config from '../shared/config';

interface Tag {
    id: number;
    name: string;
}

function TagManagement() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState('');
    
    // Form state
    const [newTagName, setNewTagName] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);
    
    // Edit state
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [editingTagName, setEditingTagName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setError('');
            const response = await backend.get<Tag[]>(config.backendUrl + 'tags');
            setTags(response.data);
        } catch (err: any) {
            console.error('Error fetching tags:', err);
            setError('Nepavyko užkrauti žymų');
        }
    };

    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTagName.trim()) {
            setError('Žymos pavadinimas negali būti tuščias');
            return;
        }

        if (newTagName.length < 5) {
            setError('Žymos pavadinimas turi būti bent 5 simbolių ilgio');
            return;
        }

        setIsAddingTag(true);
        setError('');

        try {
            const response = await backend.post<Tag>(config.backendUrl + 'tags', {
                id: 0, // Backend will assign the actual ID
                name: newTagName.trim()
            });

            setTags([...tags, response.data]);
            setNewTagName('');
            setError('');
        } catch (err: any) {
            console.error('Error adding tag:', err);
            setError(err.response?.data?.message || 'Nepavyko pridėti žymos');
        } finally {
            setIsAddingTag(false);
        }
    };

    const handleStartEdit = (tag: Tag) => {
        setEditingTagId(tag.id);
        setEditingTagName(tag.name);
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingTagId(null);
        setEditingTagName('');
        setError('');
    };

    const handleUpdateTag = async (tagId: number) => {
        if (!editingTagName.trim()) {
            setError('Žymos pavadinimas negali būti tuščias');
            return;
        }

        if (editingTagName.length < 5) {
            setError('Žymos pavadinimas turi būti bent 5 simbolių ilgio');
            return;
        }

        setIsUpdating(true);
        setError('');

        try {
            const response = await backend.put<Tag>(
                `${config.backendUrl}tags/${tagId}`,
                {
                    id: tagId,
                    name: editingTagName.trim()
                }
            );

            setTags(tags.map(tag => 
                tag.id === tagId ? response.data : tag
            ));
            setEditingTagId(null);
            setEditingTagName('');
        } catch (err: any) {
            console.error('Error updating tag:', err);
            setError(err.response?.data?.message || 'Nepavyko atnaujinti žymos');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteTag = async (tagId: number) => {
        if (!window.confirm('Ar tikrai norite ištrinti šią žymą? Šis veiksmas negrįžtamas.')) {
            return;
        }

        try {
            await backend.delete(`${config.backendUrl}tags/${tagId}`);
            setTags(tags.filter(tag => tag.id !== tagId));
            setError('');
        } catch (err: any) {
            console.error('Error deleting tag:', err);
            setError(err.response?.data?.message || 'Nepavyko ištrinti žymos');
        }
    };

    return (
        <>
            <HeaderImage 
                title="Koreguokite žymas!" 
                subtitle="Galite pridėti, atnaujinti, išimti ar peržiūrėti visas esamas žymas." 
                imgHeight="400px"
            />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setError('')}
                                    aria-label="Close"
                                ></button>
                            </div>
                        )}

                        {/* Add New Tag Form */}
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <h4 className="card-title mb-4 text-center">Pridėti naują žymą</h4>
                                <form onSubmit={handleAddTag}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-8">
                                            <label htmlFor="newTagName" className="form-label">
                                                Pavadinimas
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="newTagName"
                                                value={newTagName}
                                                onChange={(e) => setNewTagName(e.target.value)}
                                                placeholder="Pvz., naujokams, pažengusiems..."
                                                disabled={isAddingTag}
                                                minLength={5}
                                                maxLength={100}
                                                required
                                            />
                                            <small className="text-muted">
                                                Turi būti 5-100 simbolių ilgio
                                            </small>
                                        </div>
                                        <div className="col-md-4">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary w-100"
                                                disabled={isAddingTag}
                                            >
                                                {isAddingTag ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Pridedama...
                                                    </>
                                                ) : (
                                                    'Pridėti'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Tags List */}
                        <div className="card shadow">
                            <div className="card-body">
                                <h4 className="card-title mb-4 text-center">
                                    Esamos žymos 
                                </h4>

                                {tags.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <p className="mb-0">Žymų dar nėra. Sukurkite pirmąją!</p>
                                    </div>
                                ) : (
                                    <div className="list-group">
                                        {tags.map(tag => (
                                            <div 
                                                key={tag.id} 
                                                className="list-group-item"
                                            >
                                                {editingTagId === tag.id ? (
                                                    /* Edit Mode */
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editingTagName}
                                                            onChange={(e) => setEditingTagName(e.target.value)}
                                                            disabled={isUpdating}
                                                            minLength={5}
                                                            maxLength={100}
                                                            autoFocus
                                                        />
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleUpdateTag(tag.id)}
                                                            disabled={isUpdating}
                                                            title="Išsaugoti"
                                                        >
                                                            {isUpdating ? (
                                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                            ) : (
                                                                '✓'
                                                            )}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={handleCancelEdit}
                                                            disabled={isUpdating}
                                                            title="Atšaukti"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* View Mode */
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">
                                                                {tag.name}
                                                            </span>
                                                        </div>
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleStartEdit(tag)}
                                                                title="Redaguoti"
                                                            >
                                                                Redaguoti
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteTag(tag.id)}
                                                                title="Ištrinti"
                                                            >
                                                                Ištrinti
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TagManagement;