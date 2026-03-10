const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  capacity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);