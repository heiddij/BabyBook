import './App.css'
import UserList from './components/UserList'
import { Routes, Route } from 'react-router-dom'
import UserView from './components/UserView'
import BabyView from './components/BabyView'


const App = ({ users, babies }) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserView users={users} />} />
        <Route path="/users/:id/:baby" element={<BabyView babies={babies} />} />
      </Routes>
    </div>
  )
}

export default App
