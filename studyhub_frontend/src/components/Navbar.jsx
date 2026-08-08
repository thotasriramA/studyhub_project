import { Home, LogOut, PlusSquare, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-[#f4b183]/30 bg-gradient-to-r from-[#fff8f0] to-[#ffe9d6]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="font-logo text-3xl text-[#f2994a]">
          StudyHub
        </Link>

        <nav className="flex items-center gap-5">
          <Link to="/" title="Home" className="text-[#c98a56] transition-colors hover:text-[#f9a826]"><Home size={24} /></Link>
          <Link
            to="/communities"
            title="Communities"
            className="text-[#c98a56] transition-colors hover:text-[#f9a826]"
          >
            <Users size={24} />
          </Link>
          <Link
            to="/create"
            title="Create post"
            className="text-[#c98a56] transition-colors hover:text-[#f9a826]"
          >
            <PlusSquare size={24} />
          </Link>
          <Link
            to={`/profile/${user?.id}`}
            title="Profile"
            className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#f9a826]/40 transition-colors hover:border-[#f9a826]"
          >
            {user?.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f9a826]/10 text-xs font-semibold text-[#c98a56]">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-[#7f8fa6] transition-colors hover:text-red-500"
          >
            <LogOut size={22} />
          </button>
        </nav>
      </div>
    </header>
  )
}
