import React from 'react'
import Header from './Header'
// import './Header.css'
import TransactionDetail from './TransactionDetail'
import Footer from './Footer';
// import './Footer.css'

const transaction = {
    itemName: 'Antique Vase',
    username: "Sneha",
    userId: 'user123',
    highestBid: '$120'
  };

function TransactionPage() {
  return (
    <>
        <Header/>
        <TransactionDetail transaction={transaction} />
        <Footer/>
    </>
  )
}

export default TransactionPage