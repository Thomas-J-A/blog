const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: 'user',
  }
}, { timestamps: true });

// Hash password before saving doc to db
// In Document middleware, 'this' refers to the document
userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  
  next();
});

module.exports = mongoose.model('User', userSchema);
