import { Link } from 'react-router-dom'
  

const Baby = ({ baby, user }) => {
    return (
        <li>
            <Link to={`/users/${user.id}/${baby.id}`}>{baby.firstname}</Link>
        </li>
    )
}

export default Baby