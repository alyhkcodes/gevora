const dotenv = require('dotenv');
dotenv.config();
 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passport');
 
connectDB();;
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
 
// Routes
const reviewRoutes = require('./routes/reviews');
const issueRoutes = require('./routes/issues');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');
const aiRoutes = require('./routes/aiRoutes');
 
app.use('/api/reviews', reviewRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/ai', aiRoutes);
 
// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Gevora API is running' });
});
 
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
 
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
 
app.listen(PORT, () => {
  console.log(`Gevora backend running on http://localhost:${PORT}`);
});