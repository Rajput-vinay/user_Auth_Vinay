const mongoose = require('mongoose');

const dbConnect = async () => {
  try {

    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
  }
};

module.exports = {
  dbConnect,
};
