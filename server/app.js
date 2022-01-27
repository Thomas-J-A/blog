const express = require('express');

require('dotenv').config({ path: '../.env'});
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
  res.send('hello world from server');
})

app.listen(PORT, () => `Server listening on http://localhost:${ PORT }`)
