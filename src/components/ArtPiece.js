import React, { useState } from 'react';

const ArtPiece = ({ art }) => {
  const [likes, setLikes] = useState(art.likes || 0);
  const [comments, setComments] = useState(art.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="art-piece">
      <img src={art.image} alt={art.title} />
      <h2>{art.title}</h2>
      <p>by {art.artist}</p>
      <p>{art.description}</p>
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
    </div>
  );
}

export default ArtPiece;
