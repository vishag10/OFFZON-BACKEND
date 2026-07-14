import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import 'dotenv/config';
import express from 'express';
import { sessionMiddleware } from './middleware/session.js';
import { connectDatabase } from './config/database.js';
import apiGateway from './utils/apiGateway.js';
import { startKeepAlive } from './cron/keepAlive.js';
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
            startKeepAlive();
        });
    }
    catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};
startServer();
