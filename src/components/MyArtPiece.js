import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyArtPiece = ({ art, onDelete }) => {
  const [showAuctionPopup, setShowAuctionPopup] = useState(false);
  const [auctionDates, setAuctionDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startingBid, setStartingBid] = useState('');

  useEffect(() => {
    fetchAuctionDates();
  }, []);

  const fetchAuctionDates = () => {
    axios.get('http://localhost:8000/api/auction_dates/')
      .then(response => {
        console.log("Auction dates fetched successfully:", response.data);
        setAuctionDates(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the auction dates!", error);
      });
  };

  const fetchAvailableSlots = (date) => {
    axios.get(`http://localhost:8000/api/get_available_slots/?date=${date}`)
      .then(response => {
        console.log("Available slots fetched successfully:", response.data.available_slots);
        setAvailableSlots(response.data.available_slots.filter(slot => slot.available === 0));
        setShowAuctionPopup(true);
      })
      .catch(error => {
        console.error("There was an error fetching the available slots!", error);
      });
  };

  const handleAuctionButtonClick = () => {
    setShowAuctionPopup(true);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    fetchAvailableSlots(selectedDate);
  };

  const handleDelete = () => {
    axios.post('http://localhost:8000/api/delete_artwork/', { id: art._id })
      .then(response => {
        console.log("Artwork deleted successfully:", response.data);
        onDelete();
      })
      .catch(error => {
        console.error("There was an error deleting the artwork!", error);
      });
  };

  const handleAuctionSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !startingBid) {
      alert("Please select a date and enter a starting bid.");
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.selected);
    if (!selectedSlot) {
      alert("Please select an available slot.");
      return;
    }

    axios.post('http://localhost:8000/api/insert_auction/', {
      artwork_id: art._id,
      date: selectedDate,
      start_time: selectedSlot.time,
      starting_bid: startingBid,
    })
      .then(response => {
        console.log("Auction scheduled successfully:", response.data);
        setShowAuctionPopup(false);
        resetForm();
      })
      .catch(error => {
        console.error("There was an error scheduling the auction:", error);
      });
  };

  const handleSlotSelect = (index) => {
    setAvailableSlots(availableSlots.map((slot, i) => ({
      ...slot,
      selected: i === index,
    })));
  };

  const resetForm = () => {
    setSelectedDate('');
    setAvailableSlots([]);
    setStartingBid('');
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
      <h2>{art.title}</h2>
      <p>{art.description}</p>
      <button onClick={handleAuctionButtonClick}>Auction</button>
      <br />
      <button onClick={handleDelete}>Delete</button>

      {showAuctionPopup && (
        <div className="auction-popup">
          <div className="auction-popup-inner">
            <h2>Schedule Auction</h2>
            <form onSubmit={handleAuctionSubmit}>
              <label>
                Select Auction Date:
                <select onChange={handleDateChange} value={selectedDate}>
                  <option value="">Select Date</option>
                  {auctionDates.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </label>
              <h3>Available Slots</h3>
              <ul>
                {availableSlots.map((slot, index) => (
                  <li
                    key={index}
                    onClick={() => handleSlotSelect(index)}
                    style={{ cursor: 'pointer', backgroundColor: slot.selected ? 'lightgreen' : 'white' }}
                  >
                    {slot.time}
                  </li>
                ))}
              </ul>
              <label>
                Starting Bid (in Rupees):
                <input
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  placeholder="Enter starting bid"
                />
              </label>
              <br />
              <button type="submit" >Schedule Auction</button>
              <button type="button" onClick={() => {setShowAuctionPopup(false); resetForm();}}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtPiece;
