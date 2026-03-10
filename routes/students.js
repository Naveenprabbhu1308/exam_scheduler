const router      = require('express').Router();
const Student     = require('../models/Student');
const ActivityLog = require('../models/ActivityLog');
const { auth, adminOnly, staffOrAdmin } = require('../middleware/auth');

const STAFF_LIMIT = 400;

// GET all students — admin gets all, staff gets own department only
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'staff' ? { department: req.user.department } : {};
    const students = await Student.find(filter).sort({ score: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET top students
router.get('/top', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'staff' ? { department: req.user.department } : {};
    const top = await Student.find(filter).sort({ score: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD student — admin or staff
router.post('/', auth, staffOrAdmin, async (req, res) => {
  try {
    // Staff: enforce department + 400 limit
    if (req.user.role === 'staff') {
      const count = await Student.countDocuments({ assignedStaff: req.user.id });
      if (count >= STAFF_LIMIT)
        return res.status(400).json({ message: `Staff limit of ${STAFF_LIMIT} students reached` });

      req.body.department    = req.user.department;
      req.body.assignedStaff = req.user.id;
    }

    const student = await Student.create(req.body);

    await ActivityLog.create({
      action:        'ADDED',
      performedBy:   req.user.username,
      role:          req.user.role,
      department:    req.user.department || req.body.department || null,
      studentName:   student.name,
      studentRollNo: student.rollNo,
      details:       `Student ${student.name} (${student.rollNo}) added`,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE marks — admin or staff
router.put('/:id/marks', auth, staffOrAdmin, async (req, res) => {
  try {
    const { totalMarks, maxMarks } = req.body;
    const score = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { totalMarks, maxMarks, score },
      { new: true }
    );

    await ActivityLog.create({
      action:        'MARKS_UPDATED',
      performedBy:   req.user.username,
      role:          req.user.role,
      department:    req.user.department || student.department || null,
      studentName:   student.name,
      studentRollNo: student.rollNo,
      details:       `Marks updated to ${totalMarks}/${maxMarks} (score: ${score}%)`,
    });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE student — admin or staff
router.put('/:id', auth, staffOrAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await ActivityLog.create({
      action:        'UPDATED',
      performedBy:   req.user.username,
      role:          req.user.role,
      department:    req.user.department || student.department || null,
      studentName:   student.name,
      studentRollNo: student.rollNo,
      details:       `Student details updated`,
    });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE student — admin or staff
router.delete('/:id', auth, staffOrAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      action:        'DELETED',
      performedBy:   req.user.username,
      role:          req.user.role,
      department:    req.user.department || student.department || null,
      studentName:   student.name,
      studentRollNo: student.rollNo,
      details:       `Student ${student.name} (${student.rollNo}) deleted`,
    });

    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;