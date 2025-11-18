import { useState } from 'react'
import Select, { StylesConfig } from 'react-select'

import config from '../shared/config'
import backend from "../shared/backend"

function NewGroupForm(){
    const [selectedTags, setSelectedTags] = useState({})

    function handleFormSubmit(formData: FormData){
        const groupName = formData.get("groupName")
        const desc = formData.get("description")
        const maxMem = formData.get("maxMembers")
        const anyone = formData.get("anyoneJoin")

        const newGroup = {
            title: groupName,
            description: desc,
            open: anyone === 'true' ? true : false,
            maxMembers: Number(maxMem),
            userId: 1,
            tags: "not implemented"
        }

        console.log(newGroup);

        backend.post(config.backendUrl + 'group', newGroup)

        alert(`${groupName} ${desc} ${maxMem} ${anyone} ${selectedTags}`)
    }

        const customStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#212529',
            borderColor: state.isFocused ? '#4299e1' : '#4a5759',
            color: 'white',
            '&:hover': {
                borderColor: '#4299e1'
            }
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

    const options = [
        {value: 'naujokams', label: 'Naujokams'},
        {value: 'pradedantiesiems', label: 'Pradedantiesiems'},
        {value: 'pazengusiems', label: 'Pažengusiems'}
    ]

    return (
        <div className="container container-table">
            <form className="py-4 offset-2" action={handleFormSubmit}>
                <div className="row">
                    <div className="mb-3 col-6">
                        <label className="form-label">Pavadinimas</label>
                        <input name="groupName" className="form-control mb-3 shadow" id="groupTitle"/>
                        <label className="form-label">Aprašymas</label>
                        <textarea className="form-control shadow" name="description" rows={9}></textarea>
                    </div>
                    <div className="mb-3 col-4">
                        <label className="form-label">Nustatymai</label>
                        <div className="container border rounded shadow mb-3">
                            <div className="row px-2 py-2">
                                <div className="col-6">
                                    <label>Narių skaičius:</label>
                                </div>
                                <div className="col-1">
                                    <input type="number" name="maxMembers" min="4" max="7" style={{width: '100px'}}/>
                                </div>
                            </div>
                            <div className="row px-2 py-2 align-items-center">
                                <p className="col-4">Ar gali betkas prisijungti?</p>
                                <label className="col-2">Taip</label>
                                <input type="radio" className="col-2" name="anyoneJoin" value="true"/>
                                <label className="col-2">Ne</label>
                                <input type="radio" className="col-2" name="anyoneJoin" value="false"/>
                            </div>           
                        </div>
                        <Select options={options} value={selectedTags} onChange={(selected) => setSelectedTags(selected)}
                            classNamePrefix="select" className="basic-multi-select mb-3 shadow" 
                            isMulti name="tags" styles={customStyles}/>
                    </div>
                </div>
                <div className="row d-flex offset-4 col-2 py-4">
                    <button type="submit" className="btn btn-primary shadow">Patvirtinti</button>
                </div>
            </form>
        </div>
    )
}

export default NewGroupForm