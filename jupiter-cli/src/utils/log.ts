
import chalk = require('chalk')

const log = console.log

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.keyword('black');


export class Log {
    static ERROR: String = 'error';
    static INFO: String = 'info';
    static WARN: String = 'warning';
    
    static t(msg: String, style: String = 'black'): void {

        switch(style) {
            case 'error':
                log(error(msg)); 
                break;
            case 'warning':
                log(warning(msg)); 
                break;
            case 'info': 
                log(info(msg)); 
                break;
            default:
                log(msg);
                break;
        }
    }
}