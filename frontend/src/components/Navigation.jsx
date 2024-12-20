import { Link } from "react-router-dom"

const Navigation = ({ handleLogout, user }) => {
    return (
        <nav className="flex justify-end p-4 bg-my-blue">
        <div className="p-4">
            <Link to={`/`} className="font-semibold hover:font-bold">Etusivu </Link>
        </div>
        <div className="p-4">
            <Link to={`/users/${user.id}`} className="font-semibold hover:font-bold">Omat sivut </Link>
        </div>
        <div className="p-4">
            <button onClick={handleLogout} className="font-semibold hover:font-bold">Kirjaudu ulos</button>
        </div>
        </nav>
    )
}

export default Navigation