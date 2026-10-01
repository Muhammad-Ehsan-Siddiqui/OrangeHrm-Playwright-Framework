import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const logFilePath = resolve(process.cwd(), 'logs', 'test-execution.log');

async function writeLog(level: LogLevel, message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  await mkdir(dirname(logFilePath), { recursive: true });
  await appendFile(logFilePath, `${timestamp} [${level}] ${message}\n`, 'utf8');
}

export const logger = {
  debug: (message: string): Promise<void> => writeLog('DEBUG', message),
  info: (message: string): Promise<void> => writeLog('INFO', message),
  warn: (message: string): Promise<void> => writeLog('WARN', message),
  error: (message: string): Promise<void> => writeLog('ERROR', message),
};
