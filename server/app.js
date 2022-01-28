const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config({ path: '../.env'});
const PORT = process.env.PORT || 3000;

const app = express();

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.get('/', (req, res) => {
  res.send('hello world from server');
})

app.listen(PORT, () => `Server listening on http://localhost:${ PORT }`)
