import cron from 'node-cron';

export const startKeepAlive = () => {
  const url = process.env.RENDER_URL || `http://localhost:${process.env.PORT || 3060}`;

  cron.schedule('*/1 * * * *', async () => {
    try {
      await fetch(`${url}/health`);
      console.log(`[KeepAlive] Pinged at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('[KeepAlive] Ping failed:', error.message);
    }
  });
};
