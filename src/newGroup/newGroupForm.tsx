import { useState, useEffect, useRef } from 'react'
import Select, { StylesConfig } from 'react-select'

import { useNavigate } from 'react-router-dom'

import config from '../shared/config'
import backend from "../shared/backend"

import { notifySuccess, notifyFailure } from '../shared/notify'

import { TagModel, TagOption } from "../shared/models";

function NewGroupForm(){
    const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
    const [tags, setTags] = useState<TagModel[]>()
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                notifyFailure('Netinkamas failo tipas. Leidžiami: JPG, PNG, WebP')
                return
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                notifyFailure('Failas per didelis. Maksimalus dydis: 5MB')
                return
            }
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    async function handleFormSubmit(formData: FormData){
        const groupName = formData.get("groupName")
        const desc = formData.get("description")
        const maxMem = formData.get("maxMembers")

        const newGroup = {
            title: groupName,
            description: desc,
            maxMembers: Number(maxMem),
            tagIds: selectedTags.map(s => s.value)
        }

        console.log(newGroup);
        setIsSubmitting(true)

        try {
            // First create the group
            const response = await backend.post(config.backendUrl + 'groups', newGroup)
            const createdGroupId = response.data.id

            // If image is selected, upload it
            if (selectedImage && createdGroupId) {
                const imageFormData = new FormData()
                imageFormData.append('Image', selectedImage)
                
                await backend.put(
                    `${config.backendUrl}groups/${createdGroupId}/image`,
                    imageFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
            }

            notifySuccess("Sėkmingai pridėta nauja grupė!")
            navigate("../groups")
        }
        catch(err: any){
            console.error('Post error:', err);
            notifyFailure("Nepavyko pridėti naujos grupės.")
        }
        finally {
            setIsSubmitting(false)
        }
    }

    const customStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#212529',
            borderColor: state.isFocused ? '#4299e1' : '#4a5759',
            color: 'white',
            '&:hover': {
                borderColor: '#4299e1'
            },
            minHeight: '45px'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#212529',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4299e1' : state.isFocused ? '#4a5759' : '#212529',
            color: 'white',
            '&:hover': {
                backgroundColor: '#4a5759'
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#4a5759',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'white',
            '&:hover': {
                backgroundColor: '#e53e3e',
                color: 'white',
            }
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a0aec0',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        })
    }

    useEffect(() => {
        const fecthTags = async () => {
            try {
                console.log(config.backendUrl + 'group')
                const response = await backend.get<TagModel[]>(config.backendUrl + 'tags')
                setTags(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.log('Failed to fetch data');
            }
        }
        
        fecthTags();
    }, [])

    const options = tags?.map(t => ({value: t.id, label: t.name}))

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(new FormData(e.currentTarget)); }} className="needs-validation">
                        <div className="row g-4">
                            {/* Left Column - Main Info */}
                            <div className="col-lg-7">
                                <div className="card shadow-lg h-100">
                                    <div className="card-body p-4">
                                        <h4 className="card-title mb-4">Pagrindinė informacija</h4>
                                        
                                        <div className="mb-4">
                                            <label htmlFor="groupTitle" className="form-label fw-semibold">
                                                Grupės pavadinimas
                                            </label>
                                            <input 
                                                name="groupName" 
                                                className="form-control form-control-lg shadow-sm" 
                                                id="groupTitle"
                                                placeholder="Pvz., Rytinis bėgiojimas"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="groupDescription" className="form-label fw-semibold">
                                                Aprašymas
                                            </label>
                                            <textarea 
                                                className="form-control shadow-sm" 
                                                name="description" 
                                                id="groupDescription"
                                                rows={10}
                                                placeholder="Aprašykite savo grupę, veiklas, susitikimų laiką ir vietą..."
                                                required
                                            ></textarea>
                                            <div className="form-text">
                                                Aprašykite kuo išsamiau, kad žmonės žinotų, ko tikėtis
                                            </div>
                                        </div>

                                        {/* Image Upload Section */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Grupės nuotrauka
                                            </label>
                                            <div className="border rounded p-3" style={{ borderStyle: 'dashed', borderColor: '#4a5759' }}>
                                                {imagePreview ? (
                                                    <div className="text-center">
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="Preview" 
                                                            className="img-fluid rounded mb-3"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        />
                                                        <div>
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={handleRemoveImage}
                                                            >
                                                                <i className="bi bi-trash me-1"></i>
                                                                Pašalinti nuotrauką
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3">
                                                        <i className="bi bi-cloud-upload fs-1 text-muted mb-2 d-block"></i>
                                                        <p className="text-muted mb-2">Pasirinkite grupės nuotrauką</p>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            className="form-control"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={handleImageChange}
                                                        />
                                                        <div className="form-text mt-2">
                                                            Leidžiami formatai: JPG, PNG, WebP. Maks. dydis: 5MB
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Settings */}
                            <div className="col-lg-5">
                                <div className="card shadow-lg mb-4">
                                    <div className="card-body p-4">
                                        <h4 className="card-title mb-4">Nustatymai</h4>
                                        
                                        {/* Max Members */}
                                        <div className="mb-4">
                                            <label htmlFor="maxMembers" className="form-label fw-semibold">
                                                Maksimalus narių skaičius
                                            </label>
                                            <input 
                                                type="number" 
                                                name="maxMembers" 
                                                id="maxMembers"
                                                className="form-control shadow-sm" 
                                                min="2" 
                                                max="20"
                                                defaultValue="5"
                                                required
                                            />
                                            <div className="form-text">
                                                Kiek žmonių gali būti grupėje (2-20)
                                            </div>
                                        </div>

                                        {/* Access Control */}
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold d-block mb-3">
                                                Prisijungimo būdas
                                            </label>
                                            <div className="form-check mb-2">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="anyoneJoin" 
                                                    id="joinOpen"
                                                    value="true"
                                                    defaultChecked
                                                />
                                                <label className="form-check-label" htmlFor="joinOpen">
                                                    <strong>Atvira grupė</strong>
                                                    <div className="text-muted small">Bet kas gali prisijungti</div>
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="anyoneJoin" 
                                                    id="joinClosed"
                                                    value="false"
                                                />
                                                <label className="form-check-label" htmlFor="joinClosed">
                                                    <strong>Uždara grupė</strong>
                                                    <div className="text-muted small">Reikalingas patvirtinimas</div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Žymos
                                            </label>
                                            <Select 
                                                options={options} 
                                                value={selectedTags} 
                                                onChange={(selected) => setSelectedTags(selected as TagOption[])}
                                                classNamePrefix="select" 
                                                className="basic-multi-select" 
                                                isMulti 
                                                name="tags" 
                                                styles={customStyles}
                                                placeholder="Pasirinkite žymas..."
                                            />
                                            <div className="form-text">
                                                Pasirinkite žymas, kurios apibūdina jūsų grupę
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg shadow"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Kuriama...
                                            </>
                                        ) : (
                                            'Sukurti grupę'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewGroupForm