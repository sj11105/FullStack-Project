import React from 'react';
import './BidNotification.css';
import { useNavigate } from 'react-router-dom';

const BidNotification = () => {

  const navigate = useNavigate();

  return (
    <div className="notification-container">
      <div className="notification-message">
        You won the bid of e-auction
      </div>
      <div className="transaction-prompt">
        Click here for transaction
      </div>
      <button className="transaction-button" onClick={()=> navigate('/transaction')}>
        Proceed
      </button>
    </div>
  );
};

export default BidNotification;
