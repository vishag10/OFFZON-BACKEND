import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import express from 'express';
import { sessionMiddleware } from './middleware/session.ts';
import { connectDatabase } from './config/database.ts';
import apiGateway from './utils/apiGateway.ts';

const app = express();
app.use(express.json());
app.use(sessionMiddleware);

// API Gateway - All routes
app.use('/api', apiGateway);

app.get('/health', (req, res) => {
  res.json({ message: 'OFFZON is live!' });
});

const PORT = process.env.PORT || 3060;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
