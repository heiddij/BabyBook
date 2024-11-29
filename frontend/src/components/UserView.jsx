import { useParams } from "react-router-dom"
import Baby from "./Baby"
import { useSelector } from "react-redux"
import BabyForm from "./BabyForm"

const UserView = ({ users }) => {
    const id = useParams().id
    const user = users.find((u) => u.id === Number(id))
    const babies = useSelector(state => state) // kaikki vauvat
    //const userBabies = babies.filter(baby => user.babies.includes(baby))
    console.log(babies)

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>{user.username}'s babies:</h1>
            <ul>
                {babies.map(baby => 
                    <Baby key={baby.id} baby={baby.firstName} user={user} />
                )}
            </ul>
            <BabyForm />
        </div>
    )
}

export default UserView