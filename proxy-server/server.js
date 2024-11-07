const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Proxy route to fetch data from CoinGecko
app.post('/proxy', async (req, res) => {
  const url = req.body.url;  // Accept the URL from the frontend
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);  // Send data back to frontend
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
