const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  completedDates: {
    type: [Date],
    default: []
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email_id: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  habits: {
    type: [habitSchema],
    default: []
  }
}, {
  collection: 'data'
});

module.exports = mongoose.model('User', userSchema);