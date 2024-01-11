import winston from 'winston';

import config from './envConfig.js'

const LevelsOptions = {
    levels: {
        fatal: 1,
        error: 0,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'gray',
        debug: 'white',
    }
};



const loggerProd = winston.createLogger({
    levels: LevelsOptions.levels,
    transports: [
        new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize({ colors: LevelsOptions.colors }),
            winston.format.simple(),
        ),
        }),
        new winston.transports.File({ filename: './error.log', level: 'error' }),
    ],
});
const loggerDev = winston.createLogger({
    levels: LevelsOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: LevelsOptions.colors }),
                winston.format.simple(),
            ), }),
    ],
});

export const addLogger = (req, res, next) => {
    req.logger = config.env === 'prod' ? loggerProd : loggerDev;
    next();
}