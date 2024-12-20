import User from "./User"
import { useSelector } from "react-redux"

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h1>BabyBook users</h1>
      <div className="container">
        <div className="grid gap-5 md:grid-cols-3">
          {users.map(user => 
            <User key={user.id} user={user} />
          )}
        </div>
      </div>
    </div>
  )
  }
  
  export default UserList