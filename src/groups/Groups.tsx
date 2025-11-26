import HeaderImage from "../shared/headerimage/headerImage"
import AllGroups from "./AllGroups"
import RecGroupList from "./RecGroupList"

function Groups () {
    return (
        <>
            <HeaderImage title='Peržiūrėk esamas grupes!' subtitle='Surask bendraminčių ir statykit įpročius kartu!' imgHeight="400px"/>
            <RecGroupList />
            <AllGroups />
        </>
    )
}

export default Groups