import HeaderImage from '../shared/headerimage/headerImage'
import './newGroup.css'
import NewGroupForm from './newGroupForm'

function NewGroup () {
    return (
        <>
            <HeaderImage title="Sukurk naują grupę!" subtitle="Ar žinojai, kad ..."/>
            <NewGroupForm />
        </>
    )
}

export default NewGroup