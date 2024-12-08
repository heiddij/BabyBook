import { useParams } from "react-router-dom"
import Baby from "./Baby"
import BabyForm from "./BabyForm"
import { useSelector } from "react-redux"

const UserView = () => {
    const id = useParams().id
    const users = useSelector((state) => state.users);
    const user = users.find((u) => u.id === Number(id))
    console.log(user)
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
                        <Baby baby={baby} user={user} />
                    ))}
                </ul>
            ) : (
                <p>Käyttäjällä ei ole vielä vauvoja lisättynä.</p>
            )}
            <BabyForm user={user} />
        </div>

    )
}

export default UserView