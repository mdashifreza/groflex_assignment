const express = require("express");
const cors = require('cors');
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const secret_key = "2ub3h2vygcsc8s83njbjs";
app.use(bodyparser.json());
app.use(cors());

//mogodb
const User = require('./models/User');
const RegistrationModel = require('./models/RegistrationModel');

const mongoURI = "mongodb+srv://ashifcse1723:groflex123@groflexcluster.pk5zsje.mongodb.net/?retryWrites=true&w=majority";
// Connect to MongoDB
let mongoose = require("mongoose");
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("connection established with mongodb server online");
    })
    .catch((err) => {
        console.log("error while connection", err);
    });
//

const router = express.Router();

//storing user information in place of databases:::
// const users = [];

//signup endpoint
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        // const hashedpassword = await bcrypt.hash(password, 10);
        // Insert user data into MongoDB
        const user = new User({ username, password });
        await user.save();

        // users.push({ username: username, password: hashedpassword });

        res.status(201).json({ message: "signup succesfull" });
    }
    catch (error) {
        res.status(500).json({ error: "an error has occurred during signUp" });
    }
})
//Registraion Page
router.post('/register/:username', async (req, res) => {
    try {
        const registrationData = req.body;
        const registrationEntry = new RegistrationModel(registrationData);
        await registrationEntry.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//get registration
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await RegistrationModel.find();
        res.status(200).json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/registrations/:id', async (req, res) => {
    try {
        const registrationId = req.params.id;

        // Check if the registration exists
        const existingRegistration = await RegistrationModel.findById(registrationId);
        if (!existingRegistration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Delete the registration
        await RegistrationModel.findByIdAndDelete(registrationId);

        res.status(200).json({ message: 'Registration deleted successfully' });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//post 
router.put('/registrations/:id', async (req, res) => {
    try {
        const registrationId = req.params.id;
        const updatedData = req.body;

        // Check if the registration exists
        const existingRegistration = await RegistrationModel.findById(registrationId);
        if (!existingRegistration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Update the registration
        await RegistrationModel.findByIdAndUpdate(registrationId, updatedData);

        res.status(200).json({ message: 'Registration updated successfully' });
    } catch (error) {
        console.error('Error updating registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//login endpoint
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log("Login Request:", { username, password });
        // const userSearch = users.find(user => user.username === username);
        // Find user in MongoDB
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const user = await User.findOne({ username });
        console.log('login', user)

        if (!user) {
            console.error("User not found for username:", username);
            return res.status(401).json({ error: "usern not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "please login with correct password" });
        }
        console.log('Password Match:', passwordMatch);

        const token = jwt.sign({ username }, secret_key, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "an error has occurred" })
    }
})
// Password reset endpoint
router.post('/reset-password', async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });
        console.log('reset', user)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('Hashed Password:', hashedPassword);
        // Update the user's password in the database
        user.password = hashedPassword;

        // Save the updated user document
        await user.save();

        // Send a success response
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//router get 
router.get("/", (req, res) => {
    return res.json({ error: "groflex api working correct: endpoint https://groflex-assignment.vercel.app/api" })
})
//use router
app.use("/api", router);

//server 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("server is runnign at", PORT)
)
