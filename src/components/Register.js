import React, { useState } from 'react';
import axios from 'axios';
import './register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRoleId] = useState('1'); // Default role_id for user
    const [profilePicture, setProfilePicture] = useState(null); // For file upload
    const [bio, setBio] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('role_id', role_id);
        formData.append('profile_picture', profilePicture);
        formData.append('bio', bio);

        try {
            const response = await axios.post('http://localhost:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Registration successful:', response.data);
            // Handle success, e.g., redirect to login page or show success message
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle error, e.g., show error message to user
        }
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select value={role_id} onChange={(e) => setRoleId(e.target.value)} required>
                    <option value="1">User</option>
                    <option value="2">Artist</option>
                </select>
                <input type="file" onChange={handleFileChange} />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                <button type="submit" className='registerbtn'>Register</button>
            </form>
        </div>
    );
};

export default Register;
