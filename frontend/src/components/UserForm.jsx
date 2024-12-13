import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../reducers/usersReducer'
import { setNotification } from '../reducers/notificationReducer'

const UserForm = () => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const addUser = (event) => {
        event.preventDefault()

        const newUser = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password
        }
        
        dispatch(createUser(newUser))
        dispatch(
            setNotification(
              `Rekisteröinti onnistui. Voit nyt kirjautua sisään.`,
              5
            )
        )

        setFirstname('')
        setLastname('')
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Rekisteröidy</h2>
            <form onSubmit={addUser}>
                <div>
                    Nimi:
                    <input
                    type="text"
                    value={firstname}
                    name="Firstname"
                    onChange={({ target }) => setFirstname(target.value)}
                    id="firstname"
                    />
                </div>
                <div>
                    Sukunimi:
                    <input
                    type="text"
                    value={lastname}
                    name="Lastname"
                    onChange={({ target }) => setLastname(target.value)}
                    id="lastname"
                    />
                </div>
                <div>
                    Syntymäaika:
                    <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                    id="username"
                    />
                </div>
                <div>
                    Syntymäpaikka:
                    <input
                    type="text"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                    id="password"
                    />
                </div>
                <button id="submit-button" type="submit">
                    Tallenna
                </button>
            </form>
        </div>
    )
}

export default UserForm