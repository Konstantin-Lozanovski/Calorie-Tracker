import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import { useEffect, useState } from "react"
import { getUserFromLocalStorage } from "./services/auth"

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = getUserFromLocalStorage() || null
        if (storedUser) {
            setUser(storedUser)
        }
        setLoading(false)
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Header user={user} setUser={setUser} />
            <main className='main-content'>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute user={user} >
                                <Dashboard user={user} setUser={setUser} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/signup' element={<Signup user={user} setUser={setUser} />} />
                    <Route path='/login' element={<Login user={user} setUser={setUser} />} />
                </Routes>
            </main>
        </>
    )
}

export default App
