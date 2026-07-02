const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./models/Review');
const Issue = require('./models/Issue');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for seeding...');

    await Review.deleteMany();
    await Issue.deleteMany();

    const reviews = await Review.insertMany([
      { guestName: 'Priyanshu Gupta', rating: 4, comment: 'Beautiful place, loved the mountains!', sentiment: 'positive', platform: 'Google', date: '2026-06-01', issueFlag: false },
      { guestName: 'Garima Kandpal', rating: 2, comment: 'Bathroom had water damage and leaks.', sentiment: 'negative', platform: 'Airbnb', date: '2026-06-10', issueFlag: true },
      { guestName: 'Ishita Doval', rating: 5, comment: 'Exceptional hospitality, will return!', sentiment: 'positive', platform: 'Booking.com', date: '2026-06-15', issueFlag: false },
    ]);

    await Issue.insertMany([
      { title: 'Water damage in bathroom', department: 'Maintenance', priority: 'high', status: 'open', reviewId: reviews[1]._id, createdAt: '2026-06-10' },
      { title: 'WiFi connectivity issues', department: 'Tech', priority: 'medium', status: 'resolved', reviewId: null, createdAt: '2026-06-12' },
    ]);

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();