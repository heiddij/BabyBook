import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBabyProfile } from '../reducers/babyReducer'

const BabyForm = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [birthPlace, setBirthPlace] = useState('')

    const dispatch = useDispatch()

    const addBaby = (event) => {
        event.preventDefault()
        const baby = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            birthPlace: birthPlace
        }
        dispatch(createBabyProfile(baby))
    }

    return (
        <div>
            <h2>Lisää vauva</h2>
            <form onSubmit={addBaby}>
                <div>
                    Nimi:
                    <input
                    type="text"
                    value={firstName}
                    name="FirstName"
                    onChange={({ target }) => setFirstName(target.value)}
                    id="firstName"
                    />
                </div>
                <div>
                    Sukunimi:
                    <input
                    type="text"
                    value={lastName}
                    name="LastName"
                    onChange={({ target }) => setLastName(target.value)}
                    id="lastName"
                    />
                </div>
                <div>
                    Syntymäaika:
                    <input
                    type="text"
                    value={birthDate}
                    name="BirthDate"
                    onChange={({ target }) => setBirthDate(target.value)}
                    id="birthDate"
                    />
                </div>
                <div>
                    Syntymäpaikka:
                    <input
                    type="text"
                    value={birthPlace}
                    name="BirthPlace"
                    onChange={({ target }) => setBirthPlace(target.value)}
                    id="birthPlace"
                    />
                </div>
                <button id="submit-button" type="submit">
                    Tallenna
                </button>
            </form>
        </div>
    )
}

export default BabyForm