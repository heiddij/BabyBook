import { useParams } from "react-router-dom"
import Baby from "./Baby"
import BabyForm from "./BabyForm"

const UserView = ({ users, babies }) => {
    const id = useParams().id
    const user = users.find((u) => u.id === Number(id))

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>{user.username}'s babies:</h1>
            <ul>
                {babies.map(baby => 
                    <Baby key={baby.id} baby={baby} user={user} />
                )}
            </ul>
            <BabyForm />
        </div>
    )
}

export default UserView