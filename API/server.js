const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));

app.get('/api/:category/:date', async (req, res) => {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default; 

    const { category, date } = req.params;
    const apiKey = process.env.APIKEY;
    const url = `https://newsapi.org/v2/everything?q=${category}&from=${date}&language=it&sortBy=publishedAt&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get('/apiCountry/:country/:categoryid', async (req, res) => {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const { country, categoryid } = req.params;
    const apiKey = process.env.APIKEY;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${categoryid}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
