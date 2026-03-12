const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const FIRST_NAMES = [
  'ABILASH','ABISHEK','ADARSH','ADHITHYA','ADITYA','AJAY','AJEETH','AKASH','AKILAN','AKILESH',
  'ANAND','ANANTH','ANISH','ANITHA','ANNAMALAI','ANOOP','ANSAR','ANTONY','ARAVIND','ARJUN',
  'ARULRAJ','ARUNKUMAR','ARUNPRASATH','ASHOK','ASHWIN','BALAMURUGAN','BALASUNDARAM','BHARATH',
  'BHARATHIRAJA','BHUVANESH','CHANDRU','CHARAN','DHANUSH','DHARUN','DINESH','DIVYA','DURAI',
  'ELAVARASAN','ELANGO','GOKUL','GOKULNATH','GOWTHAM','GURU','GURUPRASATH','HARISH','HARIKRISHNAN',
  'HARSHINI','ILANGO','INDHUJA','ISWARYA','JAGADISH','JAGAN','JANANI','JAYAKUMAR','JEYARAJ',
  'JINESH','KAILASH','KALAI','KALAIYARASAN','KAMESH','KANNAN','KARTHICK','KARTHIK','KARTHIKEYAN',
  'KARUN','KAUSHIK','KAVINKUMAR','KAVIYA','KEERTHANA','KISHORE','KISHANTH','KOKILA','KUMARAN',
  'LAKSHMI','LATHEESH','LOGESH','LOKESH','MAHALAKSHMI','MAHESH','MALAVAN','MANIKANDAN','MANOJ',
  'MANOSIYA','MATHIYAZHAGAN','MEENA','MIDHUN','MOHAN','MUGILAN','MURALI','NAVEENPRABHU','NAVEN',
  'NITHISH','NITHISHKUMAR','OVIYA','PRABHU','PRAKASH','PRANAV','PRASANNA','PRATHEEKA','PRAVEEN',
  'PRIYA','PRIYARANJAN','RAGUL','RAHUL','RAJAN','RAJESH','RAMANAN','RAMESH','REGIN','RITHIKA',
  'RITISH','SACHIN','SANJAI','SANJEEV','SANJITH','SANTHOSH','SARAVANAN','SATHISH','SATHYA',
  'SELVAM','SENTHIL','SHANKAR','SIVA','SIVAKAMI','SIVAKUMAR','SNEHA','SUDHARSAN','SURIYA',
  'TAMIL','TAMILARASAN','THAMIZH','UDHAY','VAITHEESWARAN','VIGNESH','VIDHYA','VIKASH','VIKAS',
  'VINOTH','VISHNUPRIYA','YUVARAJ','YOKESH','ZUBER','SUBATHRA','PRINCIA','DEEPAK','DEEPIKA',
  'DHARANI','HARINI','KOWSALYA','LOGESHWARAN','MUTHUKUMAR','NANDHINI','NAVEEN','PADMANABAN',
  'PAVITHRA','POORVIKA','POOJA','RANJITH','ROHITH','RUBINI','SARANYA','SELVI','SOWMIYA',
  'SRIMATHI','SURESH','THIYAGARAJAN','VENKAT','VETRI','VIJAY','VISHNU','YAMUNA','PREMKUMAR',
  'PREETHI','MONISHA','NITHYASRI','AKSHAYA','BAVITHRA','CHANDANA','DEVI','EZHILAN','FATHIMA',
];

const LAST_PARTS = [
  'A','B','C','D','E','G','I','J','K','L','M','N','P','R','S','T','U','V','Y','Z',
  'KUMAR','RAJ','RAJAN','KANNAN','MURUGAN','SELVAM','PANDIAN','ARUMUGAM','NATARAJAN',
  'SUBRAMANIAN','KRISHNAN','PERUMAL','VENKATESH','RAMACHANDRAN','SUNDARAM','GANESAN',
  'BALASUBRAMANIAN','RAMASAMY','ANNAMALAI','PALANISWAMY',
];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomName(usedNames) {
  let name, tries = 0;
  do {
    name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_PARTS)}`;
    tries++;
  } while (usedNames.has(name) && tries < 300);
  usedNames.add(name);
  return name;
}

const departments = [
  { name: 'CSE',          deptCode: 'CS', usernamePrefix: 'cs', staffUsername: 'staff.cse',     staffPassword: 'cse.staff'     },
  { name: 'IT',           deptCode: 'IT', usernamePrefix: 'it', staffUsername: 'staff.it',      staffPassword: 'it.staff'      },
  { name: 'MECHATRONICS', deptCode: 'MZ', usernamePrefix: 'mz', staffUsername: 'staff.mz',      staffPassword: 'mz.staff'      },
  { name: 'BIOTECH',      deptCode: 'BT', usernamePrefix: 'bt', staffUsername: 'staff.biotech', staffPassword: 'biotech.staff' },
  { name: 'MECHANICAL',   deptCode: 'ME', usernamePrefix: 'me', staffUsername: 'staff.mech',    staffPassword: 'mech.staff'    },
];

function generateDeptStudents(dept) {
  const usedNames = new Set();
  const students  = [];
  for (let seq = 101; seq <= 400; seq++) {
    const name     = randomName(usedNames);
    const rollNo   = `7376231${dept.deptCode}${seq}`;
    const username = `${dept.usernamePrefix}${seq}`;
    const password = `${seq}@bit`;
    const namePart = name.toLowerCase().replace(/\s+/g, '');
    const email    = `${namePart}.${dept.deptCode.toLowerCase()}23@bitsathy.ac.in`;
    students.push({ name, rollNo, username, password, email, department: dept.name });
  }
  return students;
}

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

  const allStudentDefs = [];
  for (const dept of departments) {
    allStudentDefs.push(...generateDeptStudents(dept));
  }
  console.log(`📋 Generated ${allStudentDefs.length} student definitions`);

  console.log('⏳ Hashing passwords (may take ~30–60s)...');
  const studentUserDocs = await Promise.all(
    allStudentDefs.map(async (s) => ({
      name:       s.name,
      email:      s.email,
      username:   s.username,
      rollNo:     s.rollNo,
      password:   await bcrypt.hash(s.password, 10),
      role:       'student',
      department: s.department,
      approved:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    }))
  );

  const adminDoc = {
    name: 'Admin', email: 'admin@school.com', username: 'admin',
    password: await bcrypt.hash('admin@bitsathy', 10),
    role: 'admin', approved: true, createdAt: new Date(), updatedAt: new Date(),
  };

  const staffDocs = await Promise.all(
    departments.map(async (dept) => ({
      name:       `Staff ${dept.name}`,
      email:      `${dept.staffUsername}@school.com`,
      username:   dept.staffUsername,
      password:   await bcrypt.hash(dept.staffPassword, 10),
      role:       'staff',
      department: dept.name,
      approved:   true,
      createdAt:  new Date(),
      updatedAt:  new Date(),
    }))
  );

  await usersCollection.insertMany([adminDoc, ...staffDocs, ...studentUserDocs]);
  console.log(`✅ Users: 1 admin + ${staffDocs.length} staff + ${studentUserDocs.length} students`);

  await studentsCollection.insertMany(
    allStudentDefs.map((s) => ({
      name:       s.name,
      rollNo:     s.rollNo,
      email:      s.email,
      department: s.department,
      score:      Math.floor(Math.random() * 101),
      createdAt:  new Date(),
      updatedAt:  new Date(),
    }))
  );
  console.log(`✅ Students collection: ${allStudentDefs.length} total`);

  // ── 10 Halls: Hall A to Hall J, 30 seats each ────────────────────────────────
  const hallNames = ['Hall A','Hall B','Hall C','Hall D','Hall E',
                     'Hall F','Hall G','Hall H','Hall I','Hall J'];
  const halls = await hallsCollection.insertMany(
    hallNames.map((name) => ({ name, capacity: 30, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✅ Halls inserted: ${hallNames.length} halls (A–J, 30 seats each)`);

  const hallIds = Object.values(halls.insertedIds);

  // ── Sample exams using first 2 halls ────────────────────────────────────────
  await examsCollection.insertMany([
    { subject: 'Data Structures',      date: '2025-04-10', time: '09:00', hallIds: [hallIds[0], hallIds[1]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Operating Systems',    date: '2025-04-12', time: '09:00', hallIds: [hallIds[1], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Database Management',  date: '2025-04-14', time: '09:00', hallIds: [hallIds[0], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Computer Networks',    date: '2025-04-16', time: '09:00', hallIds: [hallIds[0], hallIds[1]], seats: [], createdAt: new Date(), updatedAt: new Date() },
    { subject: 'Software Engineering', date: '2025-04-18', time: '09:00', hallIds: [hallIds[1], hallIds[2]], seats: [], createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('✅ Exams inserted');

  console.log('\n=============================================');
  console.log('✅ Database seeded successfully!');
  console.log('=============================================');
  console.log('Admin              → username: admin          / password: admin@bitsathy');
  console.log('---------------------------------------------');
  console.log('Staff CSE          → username: staff.cse      / password: cse.staff');
  console.log('Staff IT           → username: staff.it       / password: it.staff');
  console.log('Staff MECHATRONICS → username: staff.mz       / password: mz.staff');
  console.log('Staff BIOTECH      → username: staff.biotech  / password: biotech.staff');
  console.log('Staff MECHANICAL   → username: staff.mech     / password: mech.staff');
  console.log('---------------------------------------------');
  console.log('CSE          → username: cs101–cs400  / password: 101@bit … 400@bit');
  console.log('IT           → username: it101–it400  / password: 101@bit … 400@bit');
  console.log('MECHATRONICS → username: mz101–mz400  / password: 101@bit … 400@bit');
  console.log('BIOTECH      → username: bt101–bt400  / password: 101@bit … 400@bit');
  console.log('MECHANICAL   → username: me101–me400  / password: 101@bit … 400@bit');
  console.log('=============================================');
  console.log('Halls: Hall A to Hall J (10 halls × 30 seats = 300 total seats)');
  console.log('=============================================\n');

  process.exit();
};

seed();