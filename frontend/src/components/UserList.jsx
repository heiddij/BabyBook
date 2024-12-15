import User from "./User"
import { useSelector } from "react-redux"

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h1>BabyBook users</h1>
      <ul>
        {users.map(user => 
          <User key={user.id} user={user} />
        )}
      </ul>
    </div>
  )
  }
  
  export default UserList