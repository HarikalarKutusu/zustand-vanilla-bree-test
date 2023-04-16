import winston, { Logger as WLogger, LoggerOptions } from "winston";

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp({ format: "HH:mm:ss:ms" }),
      winston.format.colorize(),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
  },
  file: {
    filename: "./logs/default.log",
    level: "info",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      //  winston.format.simple(),
    ),
  },
};

export const logger = (logFile: string) => {
  const opt = options.file;
  opt.filename = logFile;
  const fileTransport = new winston.transports.File(opt);
  const consoleTransport = new winston.transports.Console(options.console);
  fileTransport.filename = logFile;
  return winston.createLogger({
    transports: [consoleTransport, fileTransport],
  });
};
