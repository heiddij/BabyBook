import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

const BabyView = () => {
    const babies = useSelector((state) => state.babies)
    const id = useParams().babyId
    const baby = babies.find((b) => b.id === Number(id))

    if (!baby) {
        return null
    }

    return (
        <div>
            <h1>Vauvakirja</h1>
            <h2>{baby.firstname} {baby.lastname}</h2><br /> 
            <ul>
                <li>Nimi: {baby.firstname} {baby.lastname}</li>
                <li>Syntymäaika: {baby.birthdate}</li>
                <li>Syntymäpaikka: {baby.birthplace}</li>
                <li>
                    Kuva: 
                    {baby.profilepic ? (
                        <img
                        src={baby.profilepic}
                        alt={`${baby.firstname}'s profile`}
                        className="w-72 h-72 rounded-md object-cover"
                        />
                    ) : (
                        <span>Ei kuvaa saatavilla</span>
                    )}
                </li>
            </ul>
            <p>Muokkaa tietoja</p>
        </div>
    )
}

export default BabyView