import './App.css'
import UserList from './components/UserList'
import { Routes, Route } from 'react-router-dom'
import UserView from './components/UserView'


const App = ({ users }) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserView users={users} />} />
      </Routes>
    </div>
  )
}

export default App
