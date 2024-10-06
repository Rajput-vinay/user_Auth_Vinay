const express = require('express');
const { dbConnect } = require('./database/db');
const {userRouter} = require("./routes/user.route")
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT_NO || 4000;

// Connect to the database
dbConnect();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser())

//  user Routes
app.use('/api/v1',userRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
