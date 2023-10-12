import winston from 'winston';
require('winston-daily-rotate-file');
import path from 'path';

const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      name: 'info-file',
      filename: path.join(__dirname, '../', 'logs', 'filelog-info.log'),
      level: 'info',
    }),
  ],
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      name: 'internal-error',
      filename: path.join(__dirname, '../', 'logs', 'internal-error.log'),
      level: 'error',
    }),
  ],
});


const paymentErrorLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'payment-error',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'payment-error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    })
  ]
});

const transferpaymentErrorLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'transfer-error',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'transfer-error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    })
  ]
});

const transferpaymentInfoLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'transfer-info',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'transfer-info.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    })
  ]
});

const withdrawalPaymentErrorLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'withdrawal-error',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'withdrawal-error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    })
  ]
});

const withdrawalPaymentInfoLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'withdrawal-info',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'withdrawal-info.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    })
  ]
});

const depositePaymentErrorLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'deposite-error',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'deposite-error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    })
  ]
});

const depositePaymentInfoLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'deposite-info',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'deposite-info.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    })
  ]
});

const tokenizationErrorLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'tokenization-error',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'tokenization-error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
    })
  ]
});

const tokenizationInfoLogger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'tokenization-info',
      filename: path.join(__dirname, '../', 'logs/%DATE%', 'tokenization-info.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    })
  ]
});

const concurrentRequestsLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      name: 'concurrent-requests',
      filename: path.join(__dirname, '../', 'logs', 'concurrent-requests.log'),
      level: 'error',
    }),
  ],
});


const emailErrorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      name: 'email-error',
      filename: path.join(__dirname, '../', 'logs', 'email-error.log'),
      level: 'error',
    }),
  ],
});

export default {
  infoLogger,
  errorLogger,
  paymentErrorLogger,
  concurrentRequestsLogger,
  tokenizationErrorLogger,
  withdrawalPaymentErrorLogger,
  depositePaymentErrorLogger,
  transferpaymentErrorLogger,
  depositePaymentInfoLogger,
  tokenizationInfoLogger,
  withdrawalPaymentInfoLogger,
  transferpaymentInfoLogger,
  emailErrorLogger
};
//https://www.npmjs.com/package/winston-daily-rotate-file
