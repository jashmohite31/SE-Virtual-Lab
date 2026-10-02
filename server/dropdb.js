import mongoose from 'mongoose';

async function drop() {
  await mongoose.connect('mongodb://localhost:27017/software-engineering-virtual-lab');
  await mongoose.connection.db.collection('experiments').drop().catch(() => {});
  await mongoose.connection.db.collection('quizzes').drop().catch(() => {});
  console.log('Cleared old experiments and quizzes.');
  process.exit(0);
}
drop();
