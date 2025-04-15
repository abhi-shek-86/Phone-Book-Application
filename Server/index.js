require('dotenv').config();
const express = require('express');
const cors = require('cors');
import mongoose from 'mongoose';
const PhoneBook = require('./model/phonebook');

const app = express();
app.use(express.json());
app.use(cors());

const DB = process.env.MONGO_URI;
const PORT = process.env.PORT || 8001;

mongoose.connect(DB)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});

// Add a phone number
app.post('/add-phone', async (req, res) => {
    const phoneNumber = new PhoneBook(req.body);
    try {
        await phoneNumber.save();
        res.status(201).json({
            status: 'Success',
            data: { phoneNumber }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

// Get all phone numbers
app.get('/get-phone', async (req, res) => {
    try {
        const phoneNumbers = await PhoneBook.find({});
        res.status(200).json({
            status: 'Success',
            data: { phoneNumbers }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

// Update a phone number by ID
app.patch('/update-phone/:id', async (req, res) => {
    try {
        const updatedPhone = await PhoneBook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedPhone) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Phone number not found'
            });
        }
        res.status(200).json({
            status: 'Success',
            data: { updatedPhone }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

// Delete a phone number by ID
app.delete('/delete-phone/:id', async (req, res) => {
    try {
        const deletedPhone = await PhoneBook.findByIdAndDelete(req.params.id);
        if (!deletedPhone) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Phone number not found'
            });
        }
        res.status(204).json({
            status: 'Success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
