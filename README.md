# Authentication Assignments with Node.js and Google Auth

## Overview

This project demonstrates how to implement auth and  Google OAuth authentication in a Node.js application using Passport.js. Users can register, log in, and log out using their Google accounts as well as manula.

## Features

- User registration and login via Google
- JWT-based authentication
- Password reset functionality
- Email verification with OTP

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js
- Joi for validation
- bcryptjs for password hashing
- dotenv for environment variables

## env:
 
   ```bash
        PORT_NO=4000
        SESSION_SECRET=your_session_secret
        JWT_SECRET=your_jwt_secret
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
