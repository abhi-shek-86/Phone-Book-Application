const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PhoneBook = require('./model/phonebook');
require('dotenv').config(); // Load .env file

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8001;

// Use the MONGODB_URI from the .env file
const DB = process.env.MONGODB_URI;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Error connecting to database:', err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`);
});

app.post('/add-phone', async (req, res) => {
    const phoneNumber = new PhoneBook(req.body);
    try {
        await phoneNumber.save();
        res.status(201).json({
            status: 'Success',
            data: {
                phoneNumber
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err
        });
    }
});

app.get('/get-phone', async (req, res) => {
    try {
        const phoneNumbers = await PhoneBook.find({});
        res.status(200).json({
            status: 'Success',
            data: {
                phoneNumbers
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err
        });
    }
});

app.patch('/update-phone/:id', async (req, res) => {
    try {
        const updatedPhone = await PhoneBook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'Success',
            data: {
                updatedPhone
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'Failed',
            message: err
        });
    }
});

app.delete('/delete-phone/:id', async (req, res) => {
    try {
        await PhoneBook.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err
        });
    }
});
