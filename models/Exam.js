const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  rollNo:    { type: String },
  name:      { type: String },
  hallId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Hall' },
  hallName:  { type: String },
  seat:      { type: String }, // e.g. A1, B3
}, { _id: false });

const examSchema = new mongoose.Schema({
  subject:  { type: String, required: true },
  date:     { type: String, required: true },
  time:     { type: String, required: true },
  hallIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hall' }],
  seats:    [seatSchema],

  // ✅ Added fields for staff scheduling
  scheduledBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  scheduledRole: { type: String, enum: ['admin', 'staff'], default: null },
  department:    { type: String, default: null }, // dept of staff who scheduled

}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);