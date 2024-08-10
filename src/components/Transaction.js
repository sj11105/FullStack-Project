import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import NavigationBar from './Navbar';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: linear-gradient(90deg, rgba(233,194,17,1) 0%, rgba(240,197,22,1) 45%, rgba(235,139,21,1) 100%);
  color: white;
  border: none;
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    background-color: black;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 8px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 500;
`;

const PaymentButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
`;

const MyTransactions = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get('userId');
  const [incompleteTransactions, setIncompleteTransactions] = useState([]);
  const [completeTransactions, setCompleteTransactions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default payment method
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios.post('http://localhost:8000/api/transaction_update/')
        .then(() => {
          return axios.get(`http://localhost:8000/api/get_transactions_by_user/?user_id=${userId}`);
        })
        .then(response => {
          const { incomplete, complete } = response.data;
          setIncompleteTransactions(incomplete);
          setCompleteTransactions(complete);
          setLoading(false);
        })
        .catch(error => {
          console.error('There was an error fetching the transactions!', error);
          setLoading(false);
        });
    }
  }, [userId]);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleCompleteTransaction = async () => {
    if (incompleteTransactions.length === 0) return; // Ensure there are incomplete transactions
  
    // Assume only one incomplete transaction for simplicity
    const transaction = incompleteTransactions[0];

    const scriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!scriptLoaded) {
      console.error('Failed to load Razorpay script');
      return;
    }

    const options = {
      key: 'rzp_test_R7zGRnVa4dlTvi', 
      amount: transaction.amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      name: 'Art Realm',
      description: 'Complete Payment',
      handler: async function (response) {
        try {
          await axios.post('http://localhost:8000/api/update_transaction_status/', {
            transaction_id: transaction._id,
            status: 'completed',
            payment_method: paymentMethod,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          
          // Refresh the transactions
          const response = await axios.get(`http://localhost:8000/api/get_transactions_by_user/?user_id=${userId}`);
          const { incomplete, complete } = response.data;
          setIncompleteTransactions(incomplete);
          setCompleteTransactions(complete);

          setShowPopup(false);
          setSelectedTransaction(null);
        } catch (error) {
          console.error('There was an error updating the transaction!', error);
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <NavigationBar />
      <h2>My Transactions</h2>
      <h3>Incomplete Transactions</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Transaction ID</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {incompleteTransactions.length > 0 ? (
            incompleteTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.transaction_id}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4">No incomplete transactions</TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
      
      <h3>Complete Transactions</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Transaction ID</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {completeTransactions.length > 0 ? (
            completeTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.transaction_id}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="3">No complete transactions</TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      
        <Button onClick={handleCompleteTransaction}>Complete</Button>
  
    </Container>
  );
};

export default MyTransactions;
