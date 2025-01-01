import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './components/UserList'
import UserView from './components/UserView'
import BabyView from './components/BabyView'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBabies } from './reducers/babyReducer'
import { initializePosts } from './reducers/postReducer'
import { passUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import babyService from './services/babies'
import postService from './services/posts'
import followService from './services/follow'
import UserForm from './components/UserForm'
import Navigation from './components/Navigation'
import Spinner from './components/Spinner'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(initializeUsers())
      dispatch(initializeBabies())
      dispatch(initializePosts())

      const loggedUserJSON = window.localStorage.getItem('loggedUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        dispatch(passUser(user))
        babyService.setToken(user.token)
        postService.setToken(user.token)
        followService.setToken(user.token)
      }
      setLoading(false)
    }

    fetchData()
  }, [dispatch])

  if (loading) {
    return <Spinner />
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(passUser(null))
  }
  
  return (
    <div>
      { user && <Navigation handleLogout={handleLogout} user={user} /> }
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={user ? <UserList /> : <Navigate replace to="/login" />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/users/:id/:babyId" element={<BabyView />} />
        <Route path="/registration" element={<UserForm />} />
      </Routes>
    </div>
  )
}

export default App
