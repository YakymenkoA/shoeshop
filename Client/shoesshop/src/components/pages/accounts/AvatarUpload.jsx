import React, { useState } from 'react'
import { UserService } from '../../../services/userService'

function AvatarUpload({ userPhoto }) {
    const API_URL = process.env.REACT_APP_FILES_FOLDER
    const [selectedFile, setSelectedFile] = useState(null)
    const [photo, setPhoto] = useState(`${API_URL}/${userPhoto}`)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file)
            setPhoto(URL.createObjectURL(file))
        }
    }

    const handleFileUpload = async () => {
        if (selectedFile) {
            const formData = new FormData()
            formData.append('file', selectedFile)
            
            try {
                const response = await UserService.updateUserAvatar(formData)
                if (response.status === 200) {
                    setPhoto(`${API_URL}/${response.data}`)
                    setSelectedFile(null)
                    alert('Your avatar was updated!')
                }
            } catch (error) {
                alert(`Failed to upload avatar: ${error}`)
            }
        }
        else {
            alert("Click on the current avatar and select new file to upload!")
        }
    }

    return (
        <div className="avatar-upload-container">
            <img 
                src={photo} 
                alt="avatar"
                id="avatar"
                className="rounded-circle img-fluid d-block mx-auto" 
                style={{ width: '200px', cursor: "pointer" }} 
                onClick={() => document.getElementById('fileInput').click()} 
            />
            { !selectedFile && (<label htmlFor="fileInput" style={{ cursor: "pointer" }}><span className="avatar-text">Select file</span></label>)}
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            {selectedFile && (
                <button onClick={handleFileUpload} style={{ display: 'block', margin: 'auto', marginTop: '20px' }} className="btn btn-primary">
                    Upload New Avatar
                </button>
            )}
        </div>
    )
}

export default AvatarUpload;
