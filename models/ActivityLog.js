const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action:       { type: String, required: true }, // 'ADDED' | 'UPDATED' | 'DELETED' | 'MARKS_UPDATED'
  performedBy:  { type: String, required: true }, // username
  role:         { type: String, required: true }, // 'admin' | 'staff'
  department:   { type: String, default: null },
  studentName:  { type: String },
  studentRollNo:{ type: String },
  details:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);