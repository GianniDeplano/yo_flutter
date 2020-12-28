import {Log}  from '../utils/log';
const { spawn } = require('child_process');

export class CheckEnvironment {

    constructor(){}

    start(): void {
        this._doCmd('/Users/sj555jn/Documents/EY/SIA/flutter/bin/flutter', ['doctor', '-v']);
    }

    _doCmd(cmdName: String, args: any): void {
        const cmd = spawn(cmdName, args);
        this._logCmd(cmd);
    }

    _logCmd(cmd:any): void {
        cmd.stdout.on("data", (data:any) => {
            Log.t(`${data}`);
        });

        cmd.stderr.on("data", (data:any) => {
            Log.t(`${data}`, Log.WARN);
        });

        cmd.on('error', (error:any) => {
            Log.t(`${error.message}`, Log.ERROR);
        });

        cmd.on("close", (code:any) => {
            Log.t(`Exited with code ${code}`);
        });
    }
}