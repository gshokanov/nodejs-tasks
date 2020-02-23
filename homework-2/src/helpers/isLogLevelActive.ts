import { config } from '../config/config';
import { LogLevel } from '../types/log';

const levelOrder = [LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Verbose, LogLevel.Debug];
const activeLevelIndex = levelOrder.findIndex(level => level === config.logLevel);

export function isLogLevelActive(level: LogLevel): boolean {
    return levelOrder.findIndex(lvl => lvl === level) <= activeLevelIndex;
}
