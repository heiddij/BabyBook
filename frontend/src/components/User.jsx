import { Link } from 'react-router-dom'
  

const User = ({ user }) => {
    return (
        <li>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
        </li>
    )
}

export default User