import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Define state variables
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [error, setError] = useState('');

  // Fetch phone numbers on mount
  useEffect(() => {
    getPhoneNumbers();
  }, []);

  // Fetch all phone numbers from the server
  const getPhoneNumbers = async () => {
    try {
      const response = await axios.get('https://phone-book-skdf.onrender.com/get-phone');
      setPhoneNumbers(response.data.data.phoneNumbers);
    } catch (err) {
      console.error(err);
      setError('Failed to load phone numbers. Please try again.');
    }
  };

  // Add or update phone number based on whether updateId is set
  const addOrUpdatePhoneNumber = async () => {
    if (name && phone) {
      if (updateId) {
        // Update phone number
        try {
          await axios.patch(`https://phone-book-skdf.onrender.com/update-phone/${updateId}`, {
            name,
            phone,
          });
          setUpdateId(null);
          setName('');
          setPhone('');
          getPhoneNumbers();
        } catch (err) {
          console.error(err);
          setError('Failed to update phone number.');
        }
      } else {
        // Add phone number
        try {
          await axios.post('https://phone-book-skdf.onrender.com/add-phone', {
            name,
            phone,
          });
          setName('');
          setPhone('');
          getPhoneNumbers();
        } catch (err) {
          console.error(err);
          setError('Failed to add phone number.');
        }
      }
    } else {
      setError('Both name and phone number are required.');
    }
  };

  // Delete a phone number by id
  const deletePhoneNumber = async (id) => {
    try {
      await axios.delete(`https://phone-book-skdf.onrender.com/delete-phone/${id}`);
      getPhoneNumbers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete phone number.');
    }
  };

  // Update state with the selected phone number
  const updatePhoneNumber = (phoneNumber) => {
    setUpdateId(phoneNumber._id);
    setName(phoneNumber.name);
    setPhone(phoneNumber.phone);
  };

  // Clear state and cancel update
  const cancelUpdate = () => {
    setUpdateId(null);
    setName('');
    setPhone('');
  };

  // Render the component
  return (
    <div className="container">
      <h1>Phone Book</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addOrUpdatePhoneNumber();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">{updateId ? 'Update' : 'Add'}</button>
        {updateId && (
          <button
            type="button"
            onClick={cancelUpdate}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {phoneNumbers.map((phoneNumber) => (
            <tr key={phoneNumber._id}>
              <td>{phoneNumber.name}</td>
              <td>{phoneNumber.phone}</td>
              <td>
                <button onClick={() => updatePhoneNumber(phoneNumber)}>Edit</button>
                <button onClick={() => deletePhoneNumber(phoneNumber._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
