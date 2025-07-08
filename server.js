require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const registrationRouter = require("./router/registration_router");
const raceRouter = require("./router/race_router");
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./middlewares/swagger');
const session = require('express-session');

// Use environment variable for MongoDB URL
const dbUrl = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "d86e8c0fc0f7123365a98a47b019c372",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

mongoose
  .connect(dbUrl)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Error connecting to the database:", err));

// Routes
app.use('/api/v1/races', raceRouter);
app.use('/api/v1/register', registrationRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Import and use WhatsApp chatbot routes
const whatsappBot = require('./services/chat/chatbot');
whatsappBot(app);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});