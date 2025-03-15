import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './config/database.mjs';
import userRoutes from './routes/userRoutes.mjs';
import memoryRoutes from './routes/memoryRoutes.mjs';


// Load environment variables
dotenv.config({ path: './config/.env' });

// Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes); // Ensure this line exists
app.use('/api/memory', memoryRoutes);


// Connect to MongoDB
connectDB();

// Default Route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {  // Allow e2e test parallelization with supertest
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app; // needed by supertest in e2e tests