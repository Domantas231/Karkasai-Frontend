import { useState, useEffect } from 'react'
import Select, { StylesConfig } from 'react-select'

import config from '../shared/config'
import backend from "../shared/backend"

import { TagModel, TagOption } from "../shared/models";

function NewGroupForm(){
    const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
    const [tags, setTags] = useState<TagModel[]>()

    function handleFormSubmit(formData: FormData){
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

        try {
            backend.post(config.backendUrl + 'groups', newGroup)
        }
        catch(err: any){
            console.error('Post error:', err);
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

    // const options = [
    //     {value: 'naujokams', label: 'Naujokams'},
    //     {value: 'pradedantiesiems', label: 'Pradedantiesiems'},
    //     {value: 'pazengusiems', label: 'Pažengusiems'}
    // ]

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
                                                Grupės pavadinimas <span className="text-danger">*</span>
                                            </label>
                                            <input 
                                                name="groupName" 
                                                className="form-control form-control-lg shadow-sm" 
                                                id="groupTitle"
                                                placeholder="Pvz., Rytinis bėgiojimas"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="groupDescription" className="form-label fw-semibold">
                                                Aprašymas <span className="text-danger">*</span>
                                            </label>
                                            <textarea 
                                                className="form-control shadow-sm" 
                                                name="description" 
                                                id="groupDescription"
                                                rows={14}
                                                placeholder="Aprašykite savo grupę, veiklas, susitikimų laiką ir vietą..."
                                                required
                                            ></textarea>
                                            <div className="form-text">
                                                Aprašykite kuo išsamiau, kad žmonės žinotų, ko tikėtis
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
                                                Maksimalus narių skaičius <span className="text-danger">*</span>
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
                                                Prisijungimo būdas <span className="text-danger">*</span>
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
                                    <button type="submit" className="btn btn-primary btn-lg shadow">
                                        <i className="bi bi-check-circle me-2"></i>
                                        Sukurti grupę
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