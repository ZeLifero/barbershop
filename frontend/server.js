const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// На первом этапе Express просто раздаёт статические файлы frontend.
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Gentlemen's Club запущен: http://localhost:${PORT}`);
}); 
