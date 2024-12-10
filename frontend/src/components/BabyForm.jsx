import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBaby } from '../reducers/babyReducer'
import { setNotification } from '../reducers/notificationReducer'

const BabyForm = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [birthDate, setBirthdate] = useState('')
    const [birthPlace, setBirthplace] = useState('')
    const dispatch = useDispatch()

    const addBaby = (event) => {
        event.preventDefault()

        const newBaby = {
            firstname: firstName,
            lastname: lastName,
            birthdate: birthDate,
            birthplace: birthPlace
        }
        
        dispatch(createBaby(newBaby))
        dispatch(
            setNotification(
              `Vauva ${newBaby.firstname} lisätty!`,
              5
            )
        )

        setFirstName('')
        setLastName('')
        setBirthdate('')
        setBirthplace('')
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
                    onChange={({ target }) => setBirthdate(target.value)}
                    id="birthDate"
                    />
                </div>
                <div>
                    Syntymäpaikka:
                    <input
                    type="text"
                    value={birthPlace}
                    name="BirthPlace"
                    onChange={({ target }) => setBirthplace(target.value)}
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