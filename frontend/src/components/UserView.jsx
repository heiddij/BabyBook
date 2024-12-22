import { useParams } from "react-router-dom"
import Baby from "./Baby"
import BabyForm from "./BabyForm"
import { useSelector } from "react-redux"
import { useState } from "react"

const UserView = () => {
    const id = useParams().id
    const users = useSelector((state) => state.users)
    const user = users.find((u) => u.id === Number(id))
    // TODO: user sisältää babiesin. Eli hae user babies user.babies
    const babies = useSelector((state) => state.babies)
    const userBabies = babies.filter((b) => b.userId === user.id)
    const loggedUser = useSelector((state) => state.user)
    const [addBaby, setAddBaby] = useState(false)
    const [buttonText, setButtonText] = useState("Lisää vauva")

    if (!user) {
        return null
    }

    const handleAddBaby = () => {
        setAddBaby((prevState) => {
            const newAddBaby = !prevState
            setButtonText(newAddBaby ? "Sulje lomake" : "Lisää vauva")
            return newAddBaby
        })
    }

    return (
        <div>
            <h1>Käyttäjän {user.username} vauvat:</h1>
            {userBabies.length > 0 ? (
                <ul>
                    {userBabies.map(baby => (
                        <Baby key={baby.id} baby={baby} userId={id} />
                    ))}
                </ul>
            ) : (
                <p>Käyttäjällä ei ole vielä vauvoja lisättynä.</p>
            )}
            {user.id === loggedUser.id && <button onClick={handleAddBaby} className="font-semibold hover:font-bold">{buttonText}</button>}
            {addBaby && <BabyForm user={user} />}
        </div>

    )
}

export default UserView