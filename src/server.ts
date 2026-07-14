import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.ts';
import apiGateway from './utils/apiGateway.ts';
import { startKeepAlive } from './cron/keepAlive.ts';

const app = express();

// CORS — allow frontend origin with credentials (cookies)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Parse JSON body only when content exists (refresh/logout send no body)
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('application/json') &&
      (!req.headers['content-length'] || req.headers['content-length'] === '0')) {
    req.body = {};
    return next();
  }
  next();
});
app.use(express.json());
app.use(cookieParser());

// API Gateway
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
      startKeepAlive();
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
