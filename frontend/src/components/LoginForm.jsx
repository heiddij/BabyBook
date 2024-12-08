import { useState, useEffect } from "react"
import loginService from '../services/login'
import { useDispatch } from "react-redux"
import { passUser } from '../reducers/userReducer'
import babyService from '../services/babies'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          dispatch(passUser(user))
          babyService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
          const user = await loginService.login({
            username,
            password
          })

          window.localStorage.setItem('loggedUser', JSON.stringify(user))

          babyService.setToken(user.token)
          dispatch(passUser(user))
          setUsername('')
          setPassword('')
          } catch (exception) {
            dispatch(setNotification('Wrong username or password', 5))
        }
    }

    return (
      <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleLogin}>
          <div>
          Käyttäjänimi:
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
          />
          </div>
          <div>
          Salasana:
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
          </div>
          <button type="submit">Kirjaudu</button>
      </form>
      </div>
    )
}

export default LoginForm