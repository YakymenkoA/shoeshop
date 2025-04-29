import React, { useState } from 'react'
import { UserService } from '../../../services/userService'
import { validatePassword } from "../../../services/validatePassword"

const ChangePassword = (props) => {

    const initialState = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const [passwordDetails, setPasswordDetails] = useState(initialState)
    const [error, setError] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setPasswordDetails((prevDetails) => ({ ...prevDetails, [name]: value }))

        if (name === "oldPassword") {
            if (passwordDetails.newPassword !== "" && value === passwordDetails.newPassword) {
                setError("New password cannot be the same as the old password.")
                return
            } else {
                setError("")
            }
        }

        if (name === "newPassword") {
            if (value === passwordDetails.oldPassword) {
                setError("New password cannot be the same as the old password.")
                return
            }
    
            if (passwordDetails.confirmPassword !== "" && value !== passwordDetails.confirmPassword) {
                setError("Passwords do not match.")
                return
            } else if (passwordDetails.confirmPassword === value) {
                setError("")
            }

            const passwordError = validatePassword(value)
            setError(passwordError)
        }
    
        if (name === "confirmPassword") {
            if (passwordDetails.newPassword !== "") {
                if (passwordDetails.newPassword !== value) {
                    setError("Passwords do not match.")
                    return
                } else {
                    setError("")
                }
            }
            const passwordError = validatePassword(value)
            setError(passwordError)
        }
    }

    const handleSave = async () => {
        if (error) return
        try {
            const response = await UserService.updateUserPass({password: passwordDetails.oldPassword, newPassword: passwordDetails.newPassword})
            alert(response.data)
            props.onCancel()
        } catch (error) {
            alert(error.message)
            setPasswordDetails(initialState)
        }
    }

    return (
        <div className="card mb-4 pd-5" style={{ backgroundColor: '#212020', color: '#fff' }}>
          <div className="card-body">
            <h5 className="my-3 text-center" style={{ fontSize: '2rem' }}>Change Password</h5>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordDetails.oldPassword}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
  
            <div className="form-group mt-2">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordDetails.newPassword}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
  
            <div className="form-group mt-2">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordDetails.confirmPassword}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
  
            <div className="d-flex justify-content-center">
                <button onClick={handleSave} className="btn btn-primary mt-3 w-25">Save</button>
                &nbsp;
                <button 
                    onClick={() => {
                        setPasswordDetails(initialState)
                        setError("")
                    }}
                    className="btn btn-danger mt-3 w-25">Clear
                </button>
                &nbsp;
                <button onClick={props.onCancel} className="btn btn-secondary mt-3 w-25">Cancel</button>
            </div>
          </div>
        </div>
    )
}

export default ChangePassword
