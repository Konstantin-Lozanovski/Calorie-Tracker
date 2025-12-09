import { useState } from "react"
import { Link } from "react-router-dom"

const LoginForm = ({ onSubmit }) => {
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2>Login</h2>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type='submit'>Login</button>
      <div className='link-redirect'>
        <p>
          Don't have an account? <Link to='/signup'>Register</Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
