const express = require('express');
const { searchAndExecuteCodeSnippet } = require('./gitOperations'); // Implement this function separately
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/search', async (req, res) => {
  const searchTerm = req.body.searchTerm;
  try {
    const result = await searchAndExecuteCodeSnippet(searchTerm);
    console.log(result);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});