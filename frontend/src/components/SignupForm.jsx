import { useState } from "react"
import { Link } from "react-router-dom"
import "../css/auth.css"

function SignupForm({ handleSignup }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const onSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    handleSignup({ email, username, password })
    }

    return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type='text'
        placeholder='Username'
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
      <input
        type='password'
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type='submit'>Register</button>

      <div className='link-redirect'>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </form>
    )
}

export default SignupForm
