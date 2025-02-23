import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const Navigation = ({ handleLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const linkStyle = 'font-semibold text-lg text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105'
  const mobileLinkStyle = 'block py-2 text-center text-white hover:bg-my-blue-dark transition'

  return (
    <nav className="bg-my-blue shadow-lg rounded-b-lg p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={linkStyle}>Etusivu</Link>
          <Link to={`/users/${user.id}`} className={linkStyle}>Omat sivut</Link>
          <Link to="/users" className={linkStyle}>Käyttäjät</Link>
        </div>
        <button onClick={handleLogout} className="hidden md:block font-semibold text-lg text-white hover:text-gray-300 transition">
          Kirjaudu ulos
        </button>
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col bg-my-blue rounded-lg shadow-md">
          <Link to="/" className={mobileLinkStyle} onClick={() => setIsOpen(false)}>Etusivu</Link>
          <Link to={`/users/${user.id}`} className={mobileLinkStyle} onClick={() => setIsOpen(false)}>Omat sivut</Link>
          <Link to="/users" className={mobileLinkStyle} onClick={() => setIsOpen(false)}>Käyttäjät</Link>
          <button onClick={handleLogout} className="py-2 text-center text-white hover:bg-my-blue-dark transition">
            Kirjaudu ulos
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navigation