import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  const [bankDetails, setBankDetails] = useState('');
  const [upiId, setUpiId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [message, setMessage] = useState('');

  const handlePayment = (event) => {
    event.preventDefault();
    // Add your payment logic here
    setMessage('Payment submitted successfully!');
  };

  return (
    <div className="payment-container">
      <h2>Bank Details</h2>
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label htmlFor="bankDetails">Bank Details:</label>
          <input
            type="text"
            id="bankDetails"
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="upiId">UPI ID:</label>
          <input
            type="text"
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pinCode">Pin Code:</label>
          <input
            type="password"
            id="pinCode"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="payment-button">Pay</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PaymentForm;
