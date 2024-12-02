const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Словарь с ключевыми словами и URL
const keywords = {
  "technology": [
    "https://techcrunch.com",
    "https://www.wired.com"
  ],
  "science": [
    "https://www.scientificamerican.com",
    "https://www.nature.com"
  ]
};

// Получение списка URL по ключевому слову
app.post('/keywords', (req, res) => {
  const keyword = req.body.keyword;
  if (keywords[keyword]) {
    res.json(keywords[keyword]);
  } else {
    res.status(404).json({ error: "Ключевое слово не найдено" });
  }
});

// Эндпоинт для скачивания контента
app.post('/download', async (req, res) => {
  const url = req.body.url;

  try {
    const response = await axios.get(url, { responseType: 'stream' });

    const totalLength = response.headers['content-length'];
    let downloadedLength = 0;

    response.data.on('data', chunk => {
      downloadedLength += chunk.length;
      const progress = (downloadedLength / totalLength) * 100;
      res.write(`data: ${JSON.stringify({ progress: Math.round(progress), total: totalLength, downloaded: downloadedLength })}\n\n`);
    });

    response.data.on('end', () => {
      res.end();
    });
    
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки контента" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
