import React, {useState} from "react"
import { AuthService } from "../../../services/authService"
import { validatePassword } from "../../../services/validatePassword"

export default function SignUp(){

  const [formData, setFormData] = useState({ email: "", password: "", repeatPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name === "password") {
      if(formData.repeatPassword !== "") {
        setError(value !== formData.repeatPassword ? "Passwords do not match." : "")
      }
      const passwordError = validatePassword(value)
      setError(passwordError)
    }

    if (name === "repeatPassword") {
      setError(value !== formData.password ? "Passwords do not match." : "")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (error) return

    setLoading(true)
    try {
      const response = await AuthService.signup({ email: formData.email, password: formData.password })
      alert(response.data.message)
      window.location.href = '/signin'
    } catch (error) {
      alert(`Error: ${error.message}`)
      setFormData({ email: "", password: "", repeatPassword: "" })
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-start vh-90">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} style={{ position: "relative", opacity: loading ? 0.7 : 1 }}>

        {loading && (<div className="loader" style={{position: 'absolute', top: '30%', left: '40%'}}></div>)}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repeatPassword" className="form-label">Repeat Password</label>
            <input
              type="password"
              className="form-control"
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading || !!error} style={{ backgroundColor: "black" }}>{loading ? "Processing..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  ) 
}
