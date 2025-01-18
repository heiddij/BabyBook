import User from './User'
import { useSelector } from 'react-redux'

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h1>BabyBook käyttäjät</h1>
      <div className="container">
        <div className="grid gap-5 md:grid-cols-3">
          {users.length > 0 ? (users.map(user =>
            <User key={user.id} user={user} />
          )) : <p>Babybookilla ei ole vielä käyttäjiä!</p>}
        </div>
      </div>
    </div>
  )
}

export default UserList