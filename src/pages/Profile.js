import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Image from '../assets/img/background.jpeg'
const Profile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInput = useRef();

    const handleImageClick = () => {
        fileInput.current.click();
    }

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
      
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
      
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
      
        if (response.ok) {
          // Handle successful upload
        } else {
          // Handle error
        }
      }
    return (
        <div className="container-fluid m-0 p-0 flex-column">
            <Header />
            <div className="content d-flex">
                <div className="container">
                    <div className="row justify-content-center mt-3">
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px' }}>
                            <img class="rounded-circle" src={Image} alt="Profile" onClick={handleImageClick} style={{ width: '80%', height: '80%', objectFit: 'cover', border: '3px solid #000' }} />
                            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                        <form className="mt-3">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" placeholder="Current email" />
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-success">Change Email</button>
                            </div>
                        </form>
                        <form className="mt-3">
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                <input type="password" className="form-control" id="currentPassword" placeholder="Current password" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <input type="password" className="form-control" id="newPassword" placeholder="New password" />
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-success">Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Profile;