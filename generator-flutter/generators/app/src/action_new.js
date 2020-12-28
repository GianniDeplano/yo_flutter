'use strict';

const { spawn } = require("child_process");

module.exports = class {

    constructor(generator) {
        this.generator = generator;
    }

    do_action() {

        const flutterCmd = "/Users/sj555jn/Documents/EY/SIA/flutter/bin/flutter";
        

        const prompts = [
            {
              type: 'input',
              name: 'project_name',
              message: 'Project Name?'
            },{
                type: 'input',
                name: 'directory',
                message: 'Directory name?'
              }
          ];

        this.generator.prompt(prompts).then( props => {
            const flutter = spawn(flutterCmd, [
                'create',
                '--project-name', props.project_name,
                '-i', 'swift',
                '-a', 'kotlin'
            ]);

            this._logCmd(flutter);
        });
    }

    _logCmd(cmd) {
        cmd.stdout.on("data", data => {
            console.log(`${data}`);
        });

        cmd.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        cmd.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        cmd.on("close", code => {
            console.log(`EXIT ${code}`);
        });
    }
};
