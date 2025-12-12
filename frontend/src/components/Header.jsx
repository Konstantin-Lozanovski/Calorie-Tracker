import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import "../css/Header.css"

function Header({user, setUser}) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setUser(null)

    navigate("/login")
  }

  return (
    <header className='header'>
      <div className='header-brand'>
        <Link to='/'>DASHBOARD</Link>
      </div>
      <div></div>
      {user ? (
        <div className='header-user'>
          <Link className='header-name' to="/profile">@ {user.username}</Link>
          <button className='header-logout-button' onClick={logout}>
            Log out
          </button>
        </div>
      ) : (
        <div className='header-links'>
          <Link to='/signup' className='header-link'>
            Sign Up
          </Link>
          <Link to='/login' className='header-link'>
            Login
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
