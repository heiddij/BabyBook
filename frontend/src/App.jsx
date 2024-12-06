import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './components/UserList'
import UserView from './components/UserView'
import BabyView from './components/BabyView'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBabies } from './reducers/babyReducer'
import LoginForm from './components/LoginForm'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBabies())
  }, [])

  const users = useSelector((state) => state.users)
  const babies = useSelector((state) => state.babies)
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserView users={users} babies={babies} />} />
        <Route path="/users/:id/:babyId" element={<BabyView babies={babies} />} />
      </Routes>
    </div>
  )
}

export default App
