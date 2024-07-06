import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

import TransactionPage from './components/TransactionPage';
import BidNotificationPage from './components/BidNotificationPage';
import PaymentForm from './components/PaymentForm';


const App = () => {
  return(
    <Router>
    <Routes>
      <Route path='/notification' element={ <BidNotificationPage/> } />
      <Route path='/transaction' element={ <TransactionPage/> } />
      <Route path='/paymentform' element={ <PaymentForm/>}/>
    </Routes>
  </Router>
  )
};

export default App;
