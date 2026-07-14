import dns from 'dns';
import session from 'express-session';
import MongoStore from 'connect-mongo';
dns.setServers(['8.8.8.8', '8.8.4.4']);
export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
});
