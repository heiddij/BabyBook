import { useParams } from "react-router-dom"

const BabyView = ({ babies }) => {
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
            </ul>
            <p>Muokkaa tietoja</p>
        </div>
    )
}

export default BabyView