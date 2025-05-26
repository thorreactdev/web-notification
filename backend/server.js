const express = require('express');
const amqp = require('amqplib');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const routes = require("./routes");
const { connect } = require("./rabbitmq");

//initialize express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// cors oprions and config
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
let channel;


// route statement
app.use("/api", routes);

app.listen(PORT, async () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    try {
      await connect(); // Now RabbitMQ should be ready
      console.log("Connected to RabbitMQ");
    } catch (err) {
      console.error("RabbitMQ connection failed", err);
      process.exit(1); // Exit if RabbitMQ isn't available
    }
  });
