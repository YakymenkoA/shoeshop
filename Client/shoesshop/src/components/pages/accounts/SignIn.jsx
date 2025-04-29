import React, {useState} from "react"
import  {AuthService}  from "../../../services/authService"

export default function SignIn(){

  const [formData, setFormData] = useState({ email: "", password: ""})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await AuthService.signin({ email: formData.email, password: formData.password })
      window.location.href = '/catalog'
    } catch (error) {
      alert(`Error: ${error.message}.`)
      setFormData({ ...formData, password: "" })
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-start vh-90">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Sign In</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "black" }}>Sign In</button>
        </form>
      </div>
    </div>
  ) 
}
