import { Link } from 'react-router-dom'
  

const User = ({ user }) => {
    return <Link to={`/users/${user.id}`}>{user.username}</Link>
}

export default User