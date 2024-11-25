import User from "./User"

const UserList = ({ users }) => {
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