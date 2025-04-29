import React, { useEffect, useState } from "react"
import { UserService } from "../../../services/userService"
import { isAuthenticated } from "../../../services/isAuthenticated"
import  AvatarUpload from "./AvatarUpload"
import Orders from "./Orders"
import ChangePassword from "./ChangePassword"

export default function Profile(){
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState({ userName: false, phoneNumber: false })
    const [originalUserName, setOriginalUserName] = useState("")
    const [originalPhone, setOriginalPhone] = useState("")

    const fetchUserInfo = async () => {
        setLoading(true)

        try {
            const response = await UserService.getUserInfo()
            setUserInfo(response.data)
            setOriginalUserName(response.data.userName)
            setOriginalPhone(response.data.phoneNumber)
            setLoading(false)
        } catch (error) {
            //alert(`Error: ${error.message}`)
        }
      
    }

    useEffect(() => {
        if(!isAuthenticated()) {
            window.location.href = '/404'
        } else {
            fetchUserInfo()
        }
    },[])

    const handleSave = async (field) => {
        const updatedData = {
          [field]: userInfo[field],
        }
        setOriginalUserName(userInfo.userName)
        setOriginalPhone(userInfo.phoneNumber)
        try {
          await UserService.updateUserInfo(updatedData)
          setIsEditing((prevState) => ({ ...prevState, [field]: false }))
          alert(`Your ${field === 'userName' ? 'User Name' : 'Phone Number'} updated!`)
        } catch (error) {
          console.error(`Error updating ${field}:`, error)
        }
    }

    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleCancel = () => {
      setShowChangePassword(false);
    };

    return (
        <>
          {loading ? (
           <div className="loader"></div>
          ) : (
            <section style={{ backgroundColor: '#ffffff' }}>
            <div className="container">    
              <div className="row">
                <div className="col-lg-4">
                  <h5 style={{fontSize: '2rem', textAlign: 'center', fontWeight: 'bold'}}>Profile</h5>
                  <div className="card mb-4 pd-5" style={{ backgroundColor: '#212020', color: '#fff'}}>
                    <div className="card-body">
                      <AvatarUpload userPhoto={userInfo.photo} />
                      <h5 className="my-3 text-center" style={{fontSize: '2rem'}}>{userInfo.userName}</h5>
                      <p className="mb-4 text-center">{userInfo.roles.includes("User") ? "Customer" : "Admin"}</p>
                      <hr />
                      <div className="row">
                        <div className="col-sm-4">
                          <p className="mb-0" style={{textAlign: "left", paddingLeft: '10px'}}>Email</p>
                        </div>
                        <div className="col-sm-8">
                          <p className="mb-0">{userInfo.email}</p>
                        </div>
                      </div>
                      <hr />
                        <div className="row">
                            <div className="col-sm-4">
                                <p className="mb-0" style={{ textAlign: "left", paddingLeft: '10px' }}>User Name</p>
                            </div>
                            <div className="col-sm-8">
                                {isEditing.userName ? (
                                <div>
                                    <input
                                    type="text"
                                    value={userInfo.userName}
                                    onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
                                    className="form-control"
                                    />
                                    <button onClick={() => handleSave("userName")} className="btn btn-primary mt-2">Save</button>
                                    &nbsp;
                                    <button onClick={() => {
                                        setIsEditing({ ...isEditing, userName: false }) 
                                        setUserInfo({ ...userInfo, userName: originalUserName })
                                    }} className="btn btn-secondary mt-2 ml-2">Cancel</button>
                                </div>
                                ) : (
                                <p
                                    className="mb-0"
                                    onClick={() => setIsEditing({ ...isEditing, userName: true })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {userInfo.userName || 'Click to add user name'}
                                </p>
                                )}
                            </div>
                        </div>
                      <hr />
                        <div className="row">
                            <div className="col-sm-4">
                                <p className="mb-0" style={{ textAlign: "left", paddingLeft: '10px' }}>Phone</p>
                            </div>
                            <div className="col-sm-8">
                                {isEditing.phoneNumber ? (
                                <div>
                                    <input
                                    type="text"
                                    value={userInfo.phoneNumber}
                                    onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                                    className="form-control"
                                    />
                                    <button onClick={() => handleSave("phoneNumber")} className="btn btn-primary mt-2">Save</button>
                                    &nbsp;
                                    <button onClick={() => {
                                        setIsEditing({ ...isEditing, phoneNumber: false })
                                        setUserInfo({ ...userInfo, phoneNumber: originalPhone })
                                    }} className="btn btn-secondary mt-2 ml-2">Cancel</button>
                                </div>
                                ) : (
                                <p
                                    className="mb-0"
                                    onClick={() => setIsEditing({ ...isEditing, phoneNumber: true })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {userInfo.phoneNumber || 'Click here to add phone number'}
                                </p>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>

                  {!showChangePassword && (
                    <button onClick={() => setShowChangePassword(true)} className="btn btn-dark" style={{ height: '50px'}}>
                      Change Password
                    </button>
                  )}

                  {showChangePassword && (
                    <ChangePassword 
                      onCancel={handleCancel} 
                    />
                  )}

                </div>
                <div className="col-lg-8 ">
                  <h5 style={{fontSize: '2rem', textAlign: 'center', fontWeight: 'bold'}}>Your Order history</h5>
                  <Orders />
                </div>
              </div>
            </div>
            </section>
          )}
        </>
      )
}