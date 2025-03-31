import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private logFilePath = path.join(__dirname, '..', 'logs.csv');

  constructor() {
    super();
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, 'Date,Level,Context,Message\n');
    }
  }

  private writeLog(level: string, message: string, context?: string) {
    console.log(message,"messge")
    const logEntry = `${new Date().toISOString()},${level},${context || 'N/A'},"${message}"\n`;
    fs.appendFileSync(this.logFilePath, logEntry);
  }

  log(message: string, context?: string) {
    this.writeLog('LOG', message, context);
    super.log(message, context);
    
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog('ERROR', `${message} ${trace ? `| Trace: ${trace}` : ''}`, context);
    super.error(message, trace, context);
   
  }

  warn(message: string, context?: string) {
    this.writeLog('WARN', message, context);
    super.warn(message, context);
  
  }


}
