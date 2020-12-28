'use strict';

const { spawn } = require("child_process");

module.exports = class {

    constructor(generator) {
        this.generator = generator;
        this.flutter = "/Users/sj555jn/Documents/EY/SIA/flutter/bin/flutter";
    }

    do_action() {
        this._doCmd(this.flutter, ['channel', 'beta']);
        this._doCmd(this.flutter, ['upgrade']);
        this._doCmd(this.flutter, ['config', '--enable-web']);
    }

    _doCmd(cmdName, args) {
        const cmd = spawn(cmdName, args);
        this._logCmd(cmd);
    }

    _logCmd(cmd) {
        cmd.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        cmd.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        cmd.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        cmd.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
    }
};
