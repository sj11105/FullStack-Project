import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
import Navbox from './Navbox';

const Register = () => {
    const initialFormState = {
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        bio: '',
        userType: '1' // Default to User
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                bio: formData.bio,
                user_type: formData.userType
            });
            if (response.status === 201) {
                setSuccessMessage('User registered successfully');
                setErrorMessage('');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setSuccessMessage('');
            setFormData(initialFormState);
        }
    };

    return (
        <div>
        <Navbox />
        <div className="background-1">
          <img src="https://res.cloudinary.com/jerrick/image/upload/v1682412853/6447953565c86d001de9aa14.jpg" alt="background" className="image" />
          <img src="https://rukminim2.flixcart.com/image/850/1000/jsdj8nk0/painting/3/y/x/npnt-can-093-perfect-original-imafdyxgkzzydpj9.jpeg?q=90&crop=false" alt="background" className="image" />
        </div>
        <div className="register-form-container">
            <h2 className="register-title">Register</h2>
            <p>And be a part of ArtRealm</p>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label className="form-label">Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Bio:</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">User Type:</label>
                    <select name="userType" value={formData.userType} onChange={handleChange} required>
                        <option value="1">User</option>
                        <option value="2">Artist</option>
                    </select>
                </div>
                <button type="submit" className="register-button">Register</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
        </div>
        </div>
    );
};

export default Register;
