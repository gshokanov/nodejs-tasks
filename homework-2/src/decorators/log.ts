import { logger } from '../config/logger';
import { LogLevel } from '../types/log';
import { isLogLevelActive } from '../helpers/isLogLevelActive';

export function log(level = LogLevel.Verbose) {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        if (!isLogLevelActive(level)) {
            return;
        }
        const serviceName = target.constructor.name;
        const originalMethod = target[methodName];
        descriptor.value = function(...args: Array<any>) {
            logger[level](`Service: ${serviceName}, method: ${methodName}, arguments: ${JSON.stringify(args)}`);
            return originalMethod.apply(this, args);
        }
    }
}
