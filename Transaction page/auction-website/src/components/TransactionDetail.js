import React from 'react';
import './TransactionDetail.css';
import { useNavigate } from 'react-router-dom';

const TransactionDetail = ({ transaction }) => {
  const navigate = useNavigate();
  return (
    <div className="transaction-container">
      <div className="transaction-field">
        <label className="field-label">Item Name:</label>
        <span className="field-value">{transaction.itemName}</span>
      </div>
      <div className="transaction-field">
        <label className="field-label">User ID:</label>
        <span className="field-value">{transaction.userId}</span>
      </div>
      <div className="transaction-field">
        <label className="field-label">User Name:</label>
        <span className="field-value">{transaction.username}</span>
      </div>
      <div className="transaction-field">
        <label className="field-label">Highest Bid Amount:</label>
        <span className="field-value">{transaction.highestBid}</span>
      </div>
      <button className="transaction-button" onClick={()=>navigate('/paymentform')}>
        Proceed
      </button>
    </div>
  );
};

export default TransactionDetail;
