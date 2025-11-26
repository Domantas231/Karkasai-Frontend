import HeaderImage from '../shared/headerimage/headerImage'
import './newGroup.css'
import NewGroupForm from './newGroupForm'

function NewGroup () {
    return (
        <>
            <HeaderImage title="Sukurk naują grupę!" subtitle="Tai gali būti pirmas žingsnis tikslo link!"/>
            <NewGroupForm />
        </>
    )
}

export default NewGroup