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

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  
  next();
});

module.exports = mongoose.model('User', userSchema);
