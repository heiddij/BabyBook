import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import BabyForm from "./BabyForm"
import { deleteBaby } from '../reducers/babyReducer'

const BabyView = () => {
    const babies = useSelector((state) => state.babies)
    const id = useParams().babyId
    const baby = babies.find((b) => b.id === Number(id))
    //const users = useSelector((state) => state.users)
    //const user = users.find((u) => u.id === baby.userId)
    const loggedUser = useSelector((state) => state.user)
    const isLoggedUser = loggedUser.id === baby.userId
    const [modifyBaby, setModifyBaby] = useState(false)
    const [buttonText, setButtonText] = useState("Muokkaa tietoja")
    const dispatch = useDispatch()

    if (!baby) {
        return <p>Vauvaa ei löydy</p>
    }

    const handleModifyBaby = () => {
        setModifyBaby((prevState) => {
            const newModifyBaby = !prevState
            setButtonText(newModifyBaby ? "Sulje lomake" : "Muokkaa tietoja")
            return newModifyBaby
        })
    }

    const handleDeleteBaby = () => {
        try {
            dispatch(deleteBaby(baby.id))
            // oletko varma
            // redirect
        } catch (exception) {
            console.log(exception)
        }
    }

    return (
        <div>
            <h1>Vauvakirja</h1>
            <div className="container mx-auto flex justify-center items-center flex-col text-center">
                {baby.profilepic ? (
                    <img
                    src={baby.profilepic}
                    alt={`${baby.firstname}'s profile`}
                    className="w-96 h-96 rounded-full object-cover mb-4"
                    />
                ) : (
                    <img src="/profile.jpg" alt="empty profilepic" className="w-72 h-72 rounded-md object-cover mb-4" />
                )}
                <h2 className="text-xl font-semibold">{baby.firstname} {baby.lastname}</h2>
                <p className="text-lg">{baby.birthdate}</p>
                <p className="text-lg">{baby.birthplace}</p>
                {isLoggedUser && 
                    <div>
                        <button onClick={handleModifyBaby} 
                        className="font-semibold hover:font-bold flex justify-self-center text-lg py-4">
                            {buttonText}
                        </button>
                        <button onClick={handleDeleteBaby} 
                        className="font-semibold bg-my-pink hover:font-bold flex justify-self-center text-lg p-4">
                            Poista
                        </button>
                    </div>
                }
                {modifyBaby && <BabyForm baby={baby} />}
            </div>
        </div>
    )
}

export default BabyView