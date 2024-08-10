import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const ArtPiece = ({ art , temp}) => {
  const [likes, setLikes] = useState(art.likes || 0);
  const [comments, setComments] = useState(art.comments || []);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');

  const handleLike = async () => {
    setLikes(likes + 1);
    try {
      // Update likes in the backend (optional)
      const response = await axios.post(`/api/like_artwork/${art._id}/`);
      console.log(response.data); // Log or handle response if needed
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment !== '') {
      try {
        // Submit new comment to the backend
        const response = await axios.post('http://localhost:8000/api/add_comment/', {
          artwork_id: art._id,
          user_id: userId,
          content: newComment,
        });
        setComments([...comments, newComment]);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (newRating > 0) {
      try {
        // Submit new rating to the backend
        const response = await axios.post('http://localhost:8000/api/add_rating/', {
          artwork_id: art._id,
          user_id: userId,
          rating: newRating,
        });
        setNewRating(0); // Reset the rating input
        console.log(response.data); // Log or handle response if needed
      } catch (error) {
        console.error('Error adding rating:', error);
      }
    }
  };

  return (
    <div className="art-piece">
      {art.image_data ? (
        <img
          className="art-image"
          src={`data:${art.image_content_type};base64,${art.image_data}`}
          alt={art.title}
        />
      ) : (
        <div className="no-image">No Image Available</div>
      )}
      <p>Rating: {art.average_rating === 0 ? 'No ratings yet' : art.average_rating.toFixed(1)}</p>
      <p style={{ color: art.is_scheduled_for_auction ? 'green' : 'red' }}>
      Status: {art.is_scheduled_for_auction ? 'Scheduled For Auction' : 'Not For Auction'}
      </p>
      <h2>{art.title}</h2>
      <p>By {art.username}</p>
      <p>{art.description}</p>
      {/* <p style={{ color: 'green' }}>Status: Not For Sale</p> */}
      <div className="likes">
        <button onClick={handleLike}>Like</button> {likes} likes
      </div>
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Submit</button>

          
        </form>

      </div>
        <div className="rating">
        <h3>Rate this artwork</h3>
        <form onSubmit={handleRatingSubmit}>
          <input
            type="number"
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
            placeholder="Enter a rating from 1 to 5"
            min="1"
            max="5"
          />
          <button type="submit">Submit Rating</button>
        </form>
      </div>
    </div>
  );
};

export default ArtPiece;
