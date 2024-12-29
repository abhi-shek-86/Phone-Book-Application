const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PhoneBook = require('./model/phonebook');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your MongoDB Atlas URI
const DB = 'mongodb+srv://vasamsettiabhi13:abhishek@cluster0.mcqtu.mongodb.net/';
const PORT = process.env.PORT || 8001;

// Connect to MongoDB Atlas
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Error connecting to database:', err.message);
        process.exit(1); // Exit on failure to connect to the database
    });

// Start the server
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
