const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from your GitHub Pages site
app.use(cors({
  origin: 'https://bobalex92.github.io'
}));

app.use(express.json());

// Proxy route to fetch data from CoinGecko
app.post('/proxy', async (req, res) => {
  const url = req.body.url;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

