import { Link } from 'react-router-dom'
  

const Baby = ({ baby, userId }) => {
    return (
        <li>
            <Link to={`/users/${userId}/${baby.id}`}>{baby.firstname}</Link>
        </li>
    )
}

export default Baby