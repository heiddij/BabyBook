import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './components/UserList'
import UserView from './components/UserView'
import BabyView from './components/BabyView'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBabies } from './reducers/babyReducer'
import { passUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import babyService from './services/babies'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBabies())

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          dispatch(passUser(user))
          babyService.setToken(user.token)
        }
  }, [])

  const users = useSelector((state) => state.users)
  const babies = useSelector((state) => state.babies)
  
  return (
    <div>
      <Notification />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/users/:id/:babyId" element={<BabyView babies={babies} />} />
      </Routes>
    </div>
  )
}

export default App
