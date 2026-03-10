const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const reset = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection.db;
  const users = db.collection('users');

  const hashed = await bcrypt.hash('admin@bitsathy', 10);

  await users.updateOne(
    { email: 'admin@school.com' },
    { $set: { password: hashed } }
  );

  console.log('✅');
  process.exit();
};

reset();