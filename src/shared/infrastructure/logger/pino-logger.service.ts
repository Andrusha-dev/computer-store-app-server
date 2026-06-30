import type {ILoggerService} from "../../contracts/logger.contract";
import pino, {Logger} from "pino";
import type {Config} from "../config";



interface Dependencies {
    config: Config
}

export class PinoLoggerService implements ILoggerService {
    private readonly logger: Logger;

    constructor({config}: Dependencies) {
        this.logger = pino({
            transport: !config.isProduction
                ? {target: "pino-pretty", options: {colorize: true}}
                : undefined,
            level: config.isProduction ? "info" : "debug"
        })
    }

    debug = (message: string, context?: object): void => {
        if (context) {
            this.logger.debug(context, message);
        } else {
            this.logger.debug(message);
        }
    }

    info = (message: string, context?: object): void => {
        if (context) {
            this.logger.info(context, message);
        } else {
            this.logger.info(message);
        }
    }

    warn = (message: string, context?: object): void => {
        if (context) {
            this.logger.warn(context, message);
        } else {
            this.logger.warn(message);
        }
    }

    error = (message: string, error?: unknown, context?: object): void => {
        const logData: Record<string, any> = {...context};

        if (error) {
            logData.err = error instanceof Error
                ? {message: error.message, stack: error.stack}
                : {rawError: error}
        }


        this.logger.error(logData, message);
    }
}