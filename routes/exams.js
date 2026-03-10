const router  = require('express').Router();
const Exam    = require('../models/Exam');
const Hall    = require('../models/Hall');
const Student = require('../models/Student');
const { auth, adminOnly } = require('../middleware/auth');

// Generate seat labels A1-F5 for a hall of 30
const generateSeats = () => {
  const rows = ['A','B','C','D','E','F'];
  const cols = [1,2,3,4,5];
  const seats = [];
  rows.forEach((r) => cols.forEach((c) => seats.push(`${r}${c}`)));
  return seats;
};

// GET all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('hallIds')
      .sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET exam by id
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('hallIds');
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Schedule exam + auto assign seats
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { subject, date, time, hallIds } = req.body;

    const halls    = await Hall.find({ _id: { $in: hallIds } });
    const students = await Student.find().sort({ rollNo: 1 });

    const seats      = [];
    const seatLabels = generateSeats();
    let   studentIdx = 0;

    for (const hall of halls) {
      for (let i = 0; i < seatLabels.length; i++) {
        if (studentIdx >= students.length) break;
        const student = students[studentIdx];
        seats.push({
          studentId: student._id,
          rollNo:    student.rollNo,
          name:      student.name,
          hallId:    hall._id,
          hallName:  hall.name,
          seat:      seatLabels[i],
        });
        studentIdx++;
      }
    }

    const exam = await Exam.create({ subject, date, time, hallIds, seats });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete exam
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;