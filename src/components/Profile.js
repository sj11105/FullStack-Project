import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavigationBar from './Navbar';
import MyArtGallery from './MyArtGallery';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artDescription, setArtDescription] = useState('');
  const [artImage, setArtImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    userType: '1' // Default value, can be adjusted based on userData.userType
  });

  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = (userId) => {
    axios.post('http://localhost:8000/api/profile/', { user_id: userId })
      .then(response => {
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          bio: response.data.bio,
          userType: response.data.user_type// Assuming user_type is numeric
        });
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArtImage(e.target.files[0]);
  };

  const handleAddArtwork = () => {
    if (!artTitle || !artDescription || !artImage) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append('title', artTitle);
    formData.append('description', artDescription);
    formData.append('image', artImage);
    formData.append('user_id', userId);

    axios.post('http://localhost:8000/api/add_artwork/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert("Artwork added successfully!");
      setShowPopup1(false);
      setArtTitle('');
      setArtDescription('');
      setArtImage(null);
    })
    .catch(error => {
      console.error("There was an error adding the artwork!", error);
    });
  };

  const handleUpdateProfile = () => {
    axios.post('http://localhost:8000/api/update_profile/', {
      user_id: userId,
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      bio: formData.bio,
      user_type: formData.userType
    })
    .then(response => {
      alert("Profile updated successfully!");
      setShowPopup2(false);
      fetchUserData(userId); // Re-fetch the updated user data
    })
    .catch(error => {
      console.error("There was an error updating the profile!", error);
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='profile'>
      <NavigationBar />
      <div className='pcont'>
        <div className='pic'>
          <img src={userData.profilePicture || "https://i.pinimg.com/originals/54/6b/e5/546be54722dc5d998209d23751b8ee24.gif"} alt="Profile" />
        </div><br></br>
        <h2><b>Username:</b> {userData.username}</h2><br></br>
        <h2><b>First Name:</b> {userData.first_name}</h2>
        <h2><b>Last Name:</b> {userData.last_name}</h2>
        <h2><b>Role: </b>{userData.role}</h2>
        <h2><b>Bio:</b> {userData.bio}</h2>
        <h2><b>Created At:</b> {userData.created_at}</h2>
        <h2><b>Updated At:</b> {userData.updated_at}</h2>
        <h2><b>Email:</b> {userData.email}</h2>
        <button onClick={() => setShowPopup1(true)}>Add Artwork</button><br></br><br></br>
        <button onClick={() => setShowPopup2(true)}>Update Profile</button>
      </div>
      
      {userData.user_type === 2 && (
        <MyArtGallery />
      )}

      {showPopup1 && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add New Artwork</h2>
            <input
              type="text"
              placeholder="Title"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={artDescription}
              onChange={(e) => setArtDescription(e.target.value)}
            ></textarea>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleAddArtwork}>Submit</button>
            <button onClick={() => setShowPopup1(false)}>Close</button>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Update Profile</h2>
            <div>
              <label>Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div>
              <label>Bio:</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} required></textarea>
            </div>
            <div>
              <label>Role:</label>
              <select name="userType" value={formData.userType} onChange={handleChange}>
                <option value="1">Collector</option>
                <option value="2">Artist</option>
              </select>
            </div>
            <button onClick={handleUpdateProfile}>Update Profile</button>
            <button onClick={() => setShowPopup2(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
