import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { Experiment } from './modules/experiments/experiment.model.js';
import { Quiz } from './modules/quizzes/quiz.model.js';
import { EXPERIMENT_METADATA } from '../../shared/experimentTypes.js';
import { DEFAULT_QUIZZES } from '../../shared/constants.js';

const seedDatabase = async () => {
  try {
    const experimentCount = await Experiment.countDocuments();
    if (experimentCount === 0) {
      console.log('🌱 Seeding experiment metadata...');
      await Experiment.insertMany(EXPERIMENT_METADATA);
      console.log('✅ Experiment metadata seeded successfully.');
    }

    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      console.log('🌱 Seeding quiz question banks...');
      const experiments = await Experiment.find();
      for (const exp of experiments) {
        const quizData = DEFAULT_QUIZZES[exp.slug];
        if (quizData) {
          await Quiz.create({
            experiment: exp._id,
            questions: quizData.questions
          });
        }
      }
      console.log('✅ Quiz question banks seeded successfully.');
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
};

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

startServer();
