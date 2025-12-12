import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import SignupForm from "../components/SignupForm"
import {signUp} from "../services/auth"

function Signup({user, setUser}) {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/", {replace: true})
    }
  }, [user])

  const handleSignup = async (formData) => {
    try {
      const res = await signUp(formData)
      setUser(res.user)
      navigate("/")
    } catch (error) {
      setError(error)
      console.error("Signup error: ", error)
    }
  }

  return (
    <div className='auth-container'>
      {error && <p>{error}</p>}
      <SignupForm handleSignup={handleSignup}/>
    </div>
  )
}

export default Signup
