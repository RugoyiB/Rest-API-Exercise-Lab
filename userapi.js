'use strict';

// ############################################# //
// ##### Server Setup for User Management API #####
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 5000; // You can change this port

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose.connect('mongodb+srv://Temp1:Temp807@cluster0.rg3zipx.mongodb.net/UserList', {
    useNewUrlParser: true, // Use the new URL parser instead of the deprecated one
    useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('User API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### User Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the User model
// This schema defines the structure of user documents in the MongoDB collection.
const userSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String } 
  });

// Create a Mongoose model from the userSchema.
// This model provides an interface to interact with the 'users' collection in MongoDB.
// Mongoose automatically pluralizes "User" to "users" for the collection name.
const User = mongoose.model("User", userSchema);


// ############################################# //
// ##### User API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle user-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/users' path.
// All routes defined on this router will be prefixed with '/api/users'.
app.use('/api/users', router);

// Route to get all users from the database.
// Handles GET requests to '/api/users/'.
router.route("/")
    .get((req, res) => {
        // Find all user documents in the 'users' collection.
        User.find()
            .then((users) => res.json(users)) // If successful, return users as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to get a specific user by its ID.
// Handles GET requests to '/api/users/:id'.
router.route("/:id")
    .get((req, res) => {
        // Find a user document by its ID from the request parameters.
        User.findById(req.params.id)
            .then((user) => res.json(user)) // If successful, return the user as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to add a new user to the database.
// Handles POST requests to '/api/users/add'.
router.route("/add")
    .post((req, res) => {
        // Extract attributes from the request body.
        const ID = req.body.ID;
        const email = req.body.email;
        const username = req.body.username;

        // Create a new User object using the extracted data.
        const newUser = new User({
            ID,
            email,
            username
        });

        // Save the new user document to the database.
        newUser
            .save()
            .then(() => res.json("User added!")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to update an existing user by its ID.
// Handles PUT requests to '/api/users/update/:id'.
router.route("/update/:id")
    .put((req, res) => {
        // Find the user by ID.
        User.findById(req.params.id)
            .then((user) => {
                // Update the user's attributes with data from the request body.
                user.ID = req.body.ID;
                user.email = req.body.email;
                user.username = req.body.username;

                // Save the updated user document.
                user
                    .save()
                    .then(() => res.json("User updated!")) // If successful, return success message.
                    .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
            })
            .catch((err) => res.status(400).json("Error: " + err)); // If user not found or other error, return 400.
    });

// Route to delete a user by its ID.
// Handles DELETE requests to '/api/users/delete/:id'.
router.route("/delete/:id")
    .delete((req, res) => {
        // Find and delete the user document by ID.
        User.findByIdAndDelete(req.params.id)
            .then(() => res.json("User deleted.")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });