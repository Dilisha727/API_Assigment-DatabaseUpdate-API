const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const DB_URL = 'mongodb+srv://dilishapriyashan076:UIra6PFqvGxuwJqA@weather.0jbn01a.mongodb.net/?retryWrites=true&w=majority&appName=weather';
mongoose.connect(DB_URL)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB connection error', err));

const weatherSchema = new mongoose.Schema({
  id: Number,
  city: String,
  temperature: Number,
  humidity: Number,
  airPressure: Number,
  latitude: Number,
  longitude: Number,
  description: String,
});
const Weather = mongoose.model('Weather', weatherSchema);

// Function to update weather data for all cities
async function updateWeatherData() {
  try {
    const cities = await Weather.find().distinct('city');
    cities.forEach(async (city) => {
      const updatedWeatherData = {
        temperature: Math.floor(Math.random() * 30 + 20),
        humidity: Math.floor(Math.random() * 50 + 50),
        airPressure: Math.floor(Math.random() * 1000 + 900),
        description: generateRandomDescription(),
      };

      await Weather.updateOne({ city }, updatedWeatherData);
    });
    console.log('Weather data updated for all cities');
  } catch (error) {
    console.error('Error updating weather data:', error);
  }
}

// Function to generate random description
function generateRandomDescription() {
  const descriptions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Foggy'];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Set the interval to update weather data every 5 minutes
setInterval(updateWeatherData, 5 * 60 * 1000); // 5 minutes interval

// Start updating weather data when the server starts
updateWeatherData();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
