// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT;

const baseApiEndpoint = 'http://api.openweathermap.org/geo/1.0/direct';
const appId = process.env.APPID;

const weatherApiEndpoint = 'https://api.openweathermap.org/data/2.5/weather'

// Define a route to fetch weather data
app.get('/weather', (req, res) => {
  const city = req.query.q;

  if (!city) {
    return res.status(400).send('City is required');
  }

  // Construct the URL with the query parameter
  const apiEndpoint = `${baseApiEndpoint}?q=${encodeURIComponent(city)}&limit=&appid=${appId}`;
  
  // Make the GET request using Axios
  axios.get(apiEndpoint)
    .then(response => {
      // Extract the lat and lon properties from the response data
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        
        // Construct the weather API URL
        const weatherApiUrl = `${weatherApiEndpoint}?lat=${lat}&lon=${lon}&appid=${appId}`;

        axios.get(weatherApiUrl)
          .then(response => {
            res.json(response.data);
          })
          .catch(error => {
            console.error('Error making the GET request:', error);
            res.status(500).send('Error making the GET request');
          });

      } else {
        res.status(404).send('City not found');
      }
    })
    .catch(error => {
      console.error('Error making the GET request:', error);
      res.status(500).send('Error making the GET request');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

