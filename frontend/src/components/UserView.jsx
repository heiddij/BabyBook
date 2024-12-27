import { useParams } from "react-router-dom"
import Baby from "./Baby"
import BabyForm from "./BabyForm"
import { useSelector } from "react-redux"
import { useState } from "react"

const UserView = () => {
    const id = useParams().id
    const users = useSelector((state) => state.users)
    const user = users.find((u) => u.id === Number(id))
    const babies = useSelector((state) => state.babies) // this is because the users state is not updated when adding baby
    const userBabies = babies.filter((b) => b.userId === user.id)
    const loggedUser = useSelector((state) => state.user)
    const [addBaby, setAddBaby] = useState(false)
    const [buttonText, setButtonText] = useState("Lisää vauva")

    if (!user) {
        return <p>Käyttäjää ei löydy</p>
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
            <div className="container">
                <div className="grid gap-5 md:grid-cols-3">
                {userBabies.length > 0 ? (
                    userBabies.map(baby => (
                        <Baby key={baby.id} baby={baby} userId={id} />
                    ))
                ) : (
                    <p>Käyttäjällä ei ole vielä vauvoja lisättynä.</p>
                )}
                </div>
                {user.id === loggedUser.id && 
                    <button onClick={handleAddBaby} 
                    className="font-semibold hover:font-bold flex justify-self-center text-lg py-4">
                        {buttonText}
                    </button>
                }
                {addBaby && <BabyForm />}
            </div>
        </div>

    )
}

export default UserView