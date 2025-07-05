import { Server } from 'http';
import createApp from './app';
import config, { validateConfig, logConfig } from './config';

// Validate configuration on startup
validateConfig();

// Create the Express application
const app = createApp();

// Start the server
const server: Server = app.listen(config.port, (): void => {
    console.log(`ETH Price API server running on port ${config.port}`);
    logConfig();

    if (config.nodeEnv === 'development') {
        console.log(`ETH price API: http://localhost:${config.port}/api/eth-price`);
    }
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string): void => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    server.close((err?: Error): void => {
        if (err) {
            console.error('Error during server shutdown:', err);
            process.exit(1);
        }

        console.log('Server closed successfully');
        console.log('Cleanup completed');
        console.log('Goodbye!');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout((): void => {
        console.error('Forced shutdown after 10 seconds');
        process.exit(1);
    }, 10000);
};

// Handle process signals
process.on('SIGTERM', (): void => gracefulShutdown('SIGTERM'));
process.on('SIGINT', (): void => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error): void => {
    console.error(' Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>): void => {
    console.error(' Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    process.exit(1);
});

// Handle warning events
process.on('warning', (warning: Error): void => {
    console.warn('Node.js Warning:', warning.name);
    console.warn('Message:', warning.message);
    console.warn('Stack:', warning.stack);
});

// Export server for testing
export default server;
export { config };