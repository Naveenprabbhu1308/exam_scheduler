const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/examscheduler';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const usersCollection    = db.collection('users');
  const studentsCollection = db.collection('students');
  const hallsCollection    = db.collection('halls');
  const examsCollection    = db.collection('exams');

  await usersCollection.deleteMany({});
  await studentsCollection.deleteMany({});
  await hallsCollection.deleteMany({});
  await examsCollection.deleteMany({});

  console.log('🗑️  Cleared all collections');

  const studentList = [
    { name: 'ABILASH R',                         rollNo: '7376231MZ101', email: 'abilash.mz23@bitsathy.ac.in' },
    { name: 'ANISH T',                           rollNo: '7376231MZ102', email: 'anish.mz23@bitsathy.ac.in' },
    { name: 'CHANDRA ATHITHYA M',                rollNo: '7376231MZ103', email: 'chandraathithya.mz23@bitsathy.ac.in' },
    { name: 'CHANDRU V',                         rollNo: '7376231MZ104', email: 'chandru.mz23@bitsathy.ac.in' },
    { name: 'DEVENDRAKUMAR M',                   rollNo: '7376231MZ105', email: 'devendrakumar.mz23@bitsathy.ac.in' },
    { name: 'DHARUN S',                          rollNo: '7376231MZ106', email: 'dharun.mz23@bitsathy.ac.in' },
    { name: 'DHINA S',                           rollNo: '7376231MZ107', email: 'dhina.mz23@bitsathy.ac.in' },
    { name: 'GOKULRITHIS N',                     rollNo: '7376231MZ108', email: 'gokulrithis.mz23@bitsathy.ac.in' },
    { name: 'GOWTHAM P',                         rollNo: '7376231MZ109', email: 'gowtham.mz23@bitsathy.ac.in' },
    { name: 'GURUPRASATH A',                     rollNo: '7376231MZ110', email: 'guruprasath.mz23@bitsathy.ac.in' },
    { name: 'HARESHSURYA',                       rollNo: '7376231MZ111', email: 'hareshsurya.mz23@bitsathy.ac.in' },
    { name: 'HARI PRASATH M',                    rollNo: '7376231MZ112', email: 'hariprasath.mz23@bitsathy.ac.in' },
    { name: 'HARIKRISHNAN',                      rollNo: '7376231MZ113', email: 'harikrishnan.mz23@bitsathy.ac.in' },
    { name: 'HARISH KARTHIK',                    rollNo: '7376231MZ114', email: 'harishkarthik.mz23@bitsathy.ac.in' },
    { name: 'JINESH KARTHIK',                    rollNo: '7376231MZ115', email: 'jineshkarthik.mz23@bitsathy.ac.in' },
    { name: 'KAMESH D',                          rollNo: '7376231MZ116', email: 'kamesh.mz23@bitsathy.ac.in' },
    { name: 'KAVILESH R',                        rollNo: '7376231MZ117', email: 'kavilesh.mz23@bitsathy.ac.in' },
    { name: 'KISHANTH RANGASAMY MOHANASUNDARAM', rollNo: '7376231MZ118', email: 'kishanthrangasamymohanasundaram.mz23@bitsathy.ac.in' },
    { name: 'MALAVAN G',                         rollNo: '7376231MZ119', email: 'malavan.mz23@bitsathy.ac.in' },
    { name: 'MANOSIYA U',                        rollNo: '7376231MZ120', email: 'manosiya.mz23@bitsathy.ac.in' },
    { name: 'MATHIYAZHAGAN M',                   rollNo: '7376231MZ121', email: 'mathiyazhagan.mz23@bitsathy.ac.in' },
    { name: 'MAYL KUMARAN P S',                  rollNo: '7376231MZ122', email: 'maylkumaranp.mz23@bitsathy.ac.in' },
    { name: 'MOHAMMED SHAMEEM A',                rollNo: '7376231MZ123', email: 'mohammedshameem.mz23@bitsathy.ac.in' },
    { name: 'MOHAMMED ZAKI S',                   rollNo: '7376231MZ124', email: 'mohammedzaki.mz23@bitsathy.ac.in' },
    { name: 'MUGILAN P P',                       rollNo: '7376231MZ125', email: 'mugilanp.mz23@bitsathy.ac.in' },
    { name: 'NAVEENPRABHU S',                    rollNo: '7376231MZ126', email: 'naveenprabhu.mz23@bitsathy.ac.in' },
    { name: 'NAVEN K S',                         rollNo: '7376231MZ127', email: 'navenk.mz23@bitsathy.ac.in' },
    { name: 'NITHISH S',                         rollNo: '7376231MZ128', email: 'nithish.mz23@bitsathy.ac.in' },
    { name: 'NITHISHKUMAR P',                    rollNo: '7376231MZ129', email: 'nithishkumar.mz23@bitsathy.ac.in' },
    { name: 'PRANAV Y',                          rollNo: '7376231MZ130', email: 'pranav.mz23@bitsathy.ac.in' },
    { name: 'PRATHEEKA B',                       rollNo: '7376231MZ131', email: 'pratheeka.mz23@bitsathy.ac.in' },
    { name: 'PRAVEEN A',                         rollNo: '7376231MZ132', email: 'praveen.mz23@bitsathy.ac.in' },
    { name: 'PRAVEEN S',                         rollNo: '7376231MZ133', email: 'praveen2.mz23@bitsathy.ac.in' },
    { name: 'PRINCIA I',                         rollNo: '7376231MZ134', email: 'principia.mz23@bitsathy.ac.in' },
    { name: 'PRIYARANJAN R',                     rollNo: '7376231MZ135', email: 'priyaranjan.mz23@bitsathy.ac.in' },
    { name: 'RAMANAN N',                         rollNo: '7376231MZ136', email: 'ramanan.mz23@bitsathy.ac.in' },
    { name: 'RAMESHKANNAN G',                    rollNo: '7376231MZ137', email: 'rameshkannan.mz23@bitsathy.ac.in' },
    { name: 'REGIN L',                           rollNo: '7376231MZ138', email: 'regin.mz23@bitsathy.ac.in' },
    { name: 'RITHIKA SRI M',                     rollNo: '7376231MZ139', email: 'rithikasri.mz23@bitsathy.ac.in' },
    { name: 'RITISH L',                          rollNo: '7376231MZ140', email: 'ritish.mz23@bitsathy.ac.in' },
    { name: 'SACHIN BALAJI SR',                  rollNo: '7376231MZ141', email: 'sachinbalaji.mz23@bitsathy.ac.in' },
    { name: 'SACHIN K',                          rollNo: '7376231MZ142', email: 'sachin.mz23@bitsathy.ac.in' },
    { name: 'SANJAI KRISHNAN A',                 rollNo: '7376231MZ143', email: 'sanjaikrishnan.mz23@bitsathy.ac.in' },
    { name: 'SANJEEVKUMAR S',                    rollNo: '7376231MZ144', email: 'sanjeevkumar.mz23@bitsathy.ac.in' },
    { name: 'SANJITH',                           rollNo: '7376231MZ145', email: 'sanjith.mz23@bitsathy.ac.in' },
    { name: 'SATHYA PRAKASH K',                  rollNo: '7376231MZ146', email: 'sathyaprakash.mz23@bitsathy.ac.in' },
    { name: 'SHANKAR NIDHISH P',                 rollNo: '7376231MZ147', email: 'shankarnidhish.mz23@bitsathy.ac.in' },
    { name: 'SIVA',                              rollNo: '7376231MZ148', email: 'siva.mz23@bitsathy.ac.in' },
    { name: 'SRI VAISHNAVI B',                   rollNo: '7376231MZ149', email: 'srivaishnavi.mz23@bitsathy.ac.in' },
    { name: 'SUBATHRA R',                        rollNo: '7376231MZ150', email: 'subathra.mz23@bitsathy.ac.in' },
    { name: 'SUDHARSAN R',                       rollNo: '7376231MZ151', email: 'sudharsan.mz23@bitsathy.ac.in' },
    { name: 'SUDHARSAN S',                       rollNo: '7376231MZ152', email: 'sudharsan2.mz23@bitsathy.ac.in' },
    { name: 'SURIYA RAJA M R',                   rollNo: '7376231MZ153', email: 'suriyaraja.mz23@bitsathy.ac.in' },
    { name: 'VAITHEESWARAN M',                   rollNo: '7376231MZ154', email: 'vaitheeswaran.mz23@bitsathy.ac.in' },
    { name: 'VIDHYA S',                          rollNo: '7376231MZ155', email: 'vidhya.mz23@bitsathy.ac.in' },
    { name: 'VIDHYASRI T',                       rollNo: '7376231MZ156', email: 'vidhyasri.mz23@bitsathy.ac.in' },
    { name: 'VIKASH P',                          rollNo: '7376231MZ157', email: 'vikash.mz23@bitsathy.ac.in' },
    { name: 'VISHNUPRIYA S',                     rollNo: '7376231MZ158', email: 'vishnupriya.mz23@bitsathy.ac.in' },
    { name: 'BALAMURUGAN G',                     rollNo: '7376241MZ502', email: 'balamurugan.mz23@bitsathy.ac.in' },
    { name: 'HARISH P',                          rollNo: '7376241MZ503', email: 'harish.mz23@bitsathy.ac.in' },
    { name: 'KARTHIK V',                         rollNo: '7376241MZ504', email: 'karthik.mz23@bitsathy.ac.in' },
    { name: 'KAVINKUMAR E D',                    rollNo: '7376241MZ505', email: 'kavinkumar.mz23@bitsathy.ac.in' },
  ];

  const hashedStudentUsers = await Promise.all(
    studentList.map(async (s) => {
      const username = s.rollNo.slice(-3);
      const password = `${username}@bit`;
      return {
        name:      s.name,
        email:     s.email,
        username:  username,
        rollNo:    s.rollNo,
        password:  await bcrypt.hash(password, 10),
        role:      'student',
        approved:  true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  const adminPassword = await bcrypt.hash('admin@bitsathy', 10);

  await usersCollection.insertMany([
    {
      name:      'Admin',
      email:     'admin@school.com',
      username:  'admin',
      password:  adminPassword,
      role:      'admin',
      approved:  true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Staff CSE', email: 'staff.cse@school.com', username: 'staff.cse',
      password: await bcrypt.hash('cse.staff', 10),
      role: 'staff', department: 'CSE', approved: true, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      name: 'Staff IT', email: 'staff.it@school.com', username: 'staff.it',
      password: await bcrypt.hash('it.staff', 10),
      role: 'staff', department: 'IT', approved: true, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      name: 'Staff ECE', email: 'staff.ece@school.com', username: 'staff.ece',
      password: await bcrypt.hash('ece.staff', 10),
      role: 'staff', department: 'ECE', approved: true, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      name: 'Staff MECH', email: 'staff.mech@school.com', username: 'staff.mech',
      password: await bcrypt.hash('mech.staff', 10),
      role: 'staff', department: 'MECH', approved: true, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      name: 'Staff BIOTECH', email: 'staff.biotech@school.com', username: 'staff.biotech',
      password: await bcrypt.hash('biotech.staff', 10),
      role: 'staff', department: 'BIOTECH', approved: true, createdAt: new Date(), updatedAt: new Date(),
    },
    ...hashedStudentUsers
  ]);

  console.log('✅ Users inserted');

  await studentsCollection.insertMany(
    studentList.map((s) => ({
      name:      s.name,
      rollNo:    s.rollNo,
      email:     s.email,
      score:     Math.floor(Math.random() * 101),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  console.log('✅ Students inserted');

  const halls = await hallsCollection.insertMany([
    { name: 'Hall A', capacity: 30, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Hall B', capacity: 30, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Hall C', capacity: 30, createdAt: new Date(), updatedAt: new Date() },
  ]);

  console.log('✅ Halls inserted');

  const hallIds = halls.insertedIds;

  await examsCollection.insertMany([
    { subject: 'Data Structures',      date: '2025-04-10', time: '09:00', hallIds: [hallIds[0], hallIds[1]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Operating Systems',    date: '2025-04-12', time: '09:00', hallIds: [hallIds[1], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Database Management',  date: '2025-04-14', time: '09:00', hallIds: [hallIds[0], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Computer Networks',    date: '2025-04-16', time: '09:00', hallIds: [hallIds[0], hallIds[1]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Software Engineering', date: '2025-04-18', time: '09:00', hallIds: [hallIds[1], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
  ]);

  console.log('✅ Exams inserted');

  console.log('\n=============================');
  console.log('✅ Database seeded!');
  console.log('=============================');
  console.log('Admin      → username: admin       / password: admin@bitsathy');
  console.log('-----------------------------');
  console.log('Staff CSE  → username: staff.cse   / password: cse.staff');
  console.log('Staff IT   → username: staff.it    / password: it.staff');
  console.log('Staff ECE  → username: staff.ece   / password: ece.staff');
  console.log('Staff MECH → username: staff.mech  / password: mech.staff');
  console.log('Staff BIO  → username: staff.biotech / password: biotech.staff');
  console.log('-----------------------------');
  console.log('Students   → username: 101         / password: 101@bit');
  console.log('             username: 126         / password: 126@bit  (Naveenprabhu)');
  console.log('             username: 502         / password: 502@bit  (Balamurugan)');
  console.log('=============================\n');

  process.exit();
};

seed();