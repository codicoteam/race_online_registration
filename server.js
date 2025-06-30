require('dotenv').config(); // Load environment variables first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const registrationRouter = require("./router/registration_router");
const raceRouter = require("./router/race_router");
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./middlewares/swagger');

// Use environment variable for MongoDB URL
const dbUrl = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


mongoose
  .connect(dbUrl)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Error connecting to the database:", err));


// Corrected router assignments
app.use('/api/v1/races', raceRouter);             // Race endpoints
app.use('/api/v1/register', registrationRouter);  // Registration endpoints
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});