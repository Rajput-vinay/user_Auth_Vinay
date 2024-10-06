const express = require('express');
const { dbConnect } = require('./database/db');
const { userRouter } = require('./routes/user.route');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');  // Import passport
const dotenv = require('dotenv');
const {googleAuthRouter} = require('./routes/googleAuthRouter');
const { userMiddelwares } = require('./middlewares/userMiddelwares');
// Load environment variables from .env file
dotenv.config();

// Initialize passport configuration
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT_NO || 4000;

// Connect to the database
dbConnect();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User Routes
app.use('/users/api/v1', userRouter);
app.use('/auth', googleAuthRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
