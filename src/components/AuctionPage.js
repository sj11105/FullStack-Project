import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import NavigationBar from './Navbar';
import { useLocation } from 'react-router-dom';

const AuctionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
`;

const ImageContainer = styled.div`
  margin: 20px;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const Image = styled.img`
  max-width: 500px;
  height: auto;
`;

const BidSection = styled.div`
  margin-top: 20px;
`;

const CurrentBid = styled.div`
  margin: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const BidInput = styled.input`
  padding: 10px;
  margin-right: 10px;
`;

const BidButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

const Dropdown = styled.select`
  padding: 10px;
  margin: 20px;
`;

const AuctionTable = styled.table`
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

const AuctionPage = ({ auctionId }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get('userId');
  const [currentBid, setCurrentBid] = useState(0);
  const [newBid, setNewBid] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [auctions, setAuctions] = useState([]);
  const [ongoingAuction, setOngoingAuction] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/auction_today_dates/')
      .then(response => {
        console.log(response.data)
        setDates(response.data || []);
      })
      .catch(error => {
        console.error('There was an error fetching the dates!', error);
      });

    axios.get('http://localhost:8000/api/get_ongoing_auction/')
      .then(response => {
        const { auctions } = response.data;
        if (auctions.length > 0) {
          setOngoingAuction(auctions[0]);
          if (auctions[0].image_data) {
            setImageSrc(`data:${auctions[0].image_content_type};base64,${auctions[0].image_data}`);
          }
        } else {
          setOngoingAuction(null);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the ongoing auction!', error);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axios.get(`http://localhost:8000/api/get_auctions_by_date/?date=${selectedDate}`)
        .then(response => {
          setAuctions(response.data.auctions || []);
        })
        .catch(error => {
          console.error('There was an error fetching the auctions!', error);
        });
    } else {
      setAuctions([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (ongoingAuction && ongoingAuction._id) {
      const fetchCurrentBid = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/get_current_bid/?auction_id=${ongoingAuction._id}`);
          setCurrentBid(response.data.current_bid);
        } catch (error) {
          console.error('There was an error fetching the current bid!', error);
        }
      };
      fetchCurrentBid();
      timer.current = setInterval(fetchCurrentBid, 5000); // Fetch current bid every 5 seconds

      return () => clearInterval(timer.current);
    }
  }, [ongoingAuction]);

  const handleBidChange = (e) => {
    setNewBid(e.target.value);
  };

  const handlePlaceBid = async () => {
    if (parseFloat(newBid) > currentBid && parseFloat(newBid) > ongoingAuction.start_bid) {
      try {
        await axios.post('http://localhost:8000/api/place_bid/', {
          auction_id: ongoingAuction._id,
          amount: newBid,
          user_id: userId
        });
        setCurrentBid(parseFloat(newBid));
        setNewBid('');
      } catch (error) {
        console.error('There was an error placing the bid!', error);
      }
    } else {
      alert('Your bid must be higher than the current bid and the starting bid.');
    }
  };

  return (
    <>
      <NavigationBar />
      <AuctionContainer>
        {ongoingAuction ? (
          <div>
            <h2>Auction Item</h2>
            <ImageContainer>
              <Image src={imageSrc || "https://via.placeholder.com/500"} alt="Auction Item" />
            </ImageContainer>
            <DetailsContainer>
              <h2>Auction Item Title: {ongoingAuction.artwork_title}</h2>
              <p>Start Time: {ongoingAuction.start_time}</p>
              <p>End Time: {ongoingAuction.end_time}</p>
              <p>Start Bid In INR: {ongoingAuction.start_bid}</p>
            </DetailsContainer>
          </div>
        ) : (
          <p>No ongoing auction at the moment.</p>
        )}
       
        <BidSection>
          <CurrentBid>Current Highest Bid: INR {currentBid}</CurrentBid>
          <div>
            <BidInput 
              type="number" 
              value={newBid} 
              onChange={handleBidChange} 
              placeholder="Enter your bid"
            />
            <BidButton onClick={handlePlaceBid}>Place Bid</BidButton>
          </div>
        </BidSection>
        <div>
        <h2><b>Auction Schedule</b></h2>
        <Dropdown onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
          <option value="">Select Date</option>
          {dates.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </Dropdown>
        </div>
       
        
        <AuctionTable>
          <thead>
            <tr>
              <TableHeader>Artwork</TableHeader>
              <TableHeader>Start Bid</TableHeader>
              <TableHeader>Start Time</TableHeader>
              <TableHeader>End Time</TableHeader>
            </tr>
          </thead>
          <tbody>
            {auctions.length > 0 ? (
              auctions.map((auction, index) => (
                <TableRow key={index}>
                  <TableCell>{auction.artwork_title}</TableCell>
                  <TableCell>{auction.start_bid}</TableCell>
                  <TableCell>{auction.start_time}</TableCell>
                  <TableCell>{auction.end_time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4">No auctions for the selected date</TableCell>
              </TableRow>
            )}
          </tbody>
        </AuctionTable>
      </AuctionContainer>
    </>
  );
};

export default AuctionPage;
