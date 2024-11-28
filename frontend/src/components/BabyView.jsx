import { useParams } from "react-router-dom"

const BabyView = ({ babies }) => {
    const babyName = useParams().baby
    const baby = babies.find((b) => b.firstName === babyName)

    if (!babyName) {
        return null
    }

    return (
        <div>
            <h1>Vauvakirja</h1>
            <h2>{babyName}</h2><br /> 
            <ul>
                <li>Nimi: {baby.firstName} {baby.lastName}</li>
                <li>Syntymäaika: {baby.birthDate}</li>
                <li>Syntymäpaikka: {baby.birthPlace}</li>
            </ul>
            <p>Muokkaa tietoja</p>
        </div>
    )
}

export default BabyView