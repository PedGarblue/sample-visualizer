// simple server just for serving assets
const express = require('express');

const server = express();

server.use(express.static('public'));

server.listen(3001, () => {
  console.log('connected to port 3001');
  console.log('Now you can open the app in http://localhost:3001');
})

// Exit/Error handlers

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = error => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
