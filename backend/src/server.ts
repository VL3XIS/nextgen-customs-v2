console.log('Starting server...');
import dotenv from 'dotenv';
dotenv.config();
import app from './app';

const PORT = process.env.PORT || 3001;

console.log(`Attempting to listen on port ${PORT}...`);
try {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    server.on('error', (err) => {
        console.error('Server failed to start:', err);
    });
} catch (e) {
    console.error('Exception starting server:', e);
}
