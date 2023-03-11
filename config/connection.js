
const mongoose = require('mongoose');

// Wrap Mongoose around local connection to MongoDB


mongoose.connect('mongodb://127.0.0.1:27017/social-network-api', {
  //useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);
module.exports = mongoose.connection;