console.log('App: Importing express/cors/dotenv...');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
console.log('App: Importing agentRoutes...');
import agentRoutes from './routes/api/agent';
console.log('App: Importing elevenLabsRoutes...');
import elevenLabsRoutes from './routes/elevenlabs';
console.log('App: Importing appointmentsRoutes...');
import appointmentsRoutes from './routes/appointments';

import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import postRoutes from './routes/posts';
import analyticsRoutes from './routes/analytics';
import userRoutes from './routes/user';
// import publicRoutes from './routes/public';
import devRoutes from './routes/dev';

console.log('App: Configuring dotenv...');
dotenv.config();
console.log('App: Dotenv configured.');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/public', publicRoutes);
app.use('/api/dev', devRoutes);

app.use('/api/agent', agentRoutes);
app.use('/api/elevenlabs', elevenLabsRoutes);
app.use('/api/appointments', appointmentsRoutes);

export default app;
