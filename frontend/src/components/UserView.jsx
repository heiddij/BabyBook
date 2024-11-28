import { useParams } from "react-router-dom"
import Baby from "./Baby"

const UserView = ({ users }) => {
    const id = useParams().id
    const user = users.find((u) => u.id === Number(id))

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>{user.username}'s babies:</h1>
            <ul>
                {user.babies.map(baby => 
                    <Baby key={baby} baby={baby} user={user} />
                )}
            </ul>
        </div>
    )
}

export default UserView