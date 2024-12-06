import { useParams } from "react-router-dom"
import Baby from "./Baby"
import BabyForm from "./BabyForm"

const UserView = ( { users }) => {
    const id = useParams().id
    const user = users.find((u) => u.id === Number(id))
    const userBabies = user.babies

    if (!user) {
        return null
    }

    return (
        <div>
            <h1>Käyttäjän {user.username} vauvat:</h1>
            {userBabies.length > 0 ? (
                <ul>
                    {userBabies.map(baby => (
                        <Baby key={baby.id} baby={baby} user={user} />
                    ))}
                </ul>
            ) : (
                <p>Käyttäjällä ei ole vielä vauvoja lisättynä.</p>
            )}
            <BabyForm />
        </div>

    )
}

export default UserView