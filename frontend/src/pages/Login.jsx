import { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router-dom"
import { login } from "../services/auth"

const LoginPage = ({ user, setUser }) => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (data) => {
    try {
      const res = await login(data)
      setUser(res.user)
      navigate("/")
    } catch (error) {
      setError(error)
      console.error("Login error: ", error)
    }
  }

  return (
    <div className='auth-container'>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}

export default LoginPage
