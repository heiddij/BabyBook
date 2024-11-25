import { useParams } from "react-router-dom"

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
                    <li key={baby}>{baby}</li>
                )}
            </ul>
        </div>
    )
}

export default UserView