import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const AddArtwork = ({ token }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);

    const handleAddArtwork = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        if (audio) {
            formData.append('audio_description', audio);
        }

        axios.post('http://127.0.0.1:8000/api/artworks/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error("There was an error adding the artwork!", error);
        });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleAddArtwork}>
                <h2>Add Artwork</h2>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
                <input type="file" onChange={(e) => setAudio(e.target.files[0])} />
                <button type="submit">Add Artwork</button>
            </form>
        </div>
    );
};

export default AddArtwork;