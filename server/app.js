const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import routes
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

require('dotenv').config({ path: '../.env'});
const PORT = process.env.PORT || 3000;

const app = express();

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// Set up middlewares
app.use(morgan('dev'));
app.use(cors({ 
  origin: 'http://localhost:8080/',  // React client
  credentials: true ,  // Allows cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());  // Parses Cookie headers and populates req.cookies (req.cookies.<cookieName>)

// Add imported routes to middleware stack
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.listen(PORT, () => `Server listening on http://localhost:${ PORT }`)
