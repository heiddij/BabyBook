import { Link } from 'react-router-dom'

const Navigation = ({ handleLogout, user }) => {
  if (!user) return null

  const linkStyle = 'font-semibold text-lg text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105'

  return (
    <nav className="flex justify-between items-center bg-my-blue shadow-lg rounded-b-lg p-6">
      <div className="flex space-x-6">
        <div>
          <Link to={'/'} className={linkStyle}>Etusivu</Link>
        </div>
        <div>
          <Link to={`/users/${user.id}`} className={linkStyle}>Omat sivut</Link>
        </div>
        <div>
          <Link to={'/users'} className={linkStyle}>Käyttäjät</Link>
        </div>
      </div>
      <div>
        <button onClick={handleLogout} className={linkStyle}>
          Kirjaudu ulos
        </button>
      </div>
    </nav>
  )
}

export default Navigation