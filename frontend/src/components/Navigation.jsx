import { Link } from "react-router-dom"

const Navigation = ({ handleLogout }) => {
    return (
        <div>
            <Link to={`/`}>Etusivu </Link>
            <Link to={`/`}>Omat sivut </Link>
            <button onClick={handleLogout}>Kirjaudu ulos</button>
        </div>
    )
}

export default Navigation