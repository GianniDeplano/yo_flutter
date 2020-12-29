import {Log}  from '../utils/log';
import ora = require('ora');
import inquirer = require('inquirer');
const { spawn } = require('child_process');

const STATES = {
    0: 'CREATE',
    1: 'ADD_LIBS',
    2: 'END'
};

const LIBS = {
    'Essentials': {
        deps: ['url-launcher', 'keyboard_visibility', 'path_provider', 'permission_handler', 'http', 'shared_preferences'],
        dev: ['flutter_launcher_icons']
    },
    'BLoC': {
        deps: ['flutter_bloc', 'equatable', 'intl'],
        dev: []
    },
    'Swagger To Code': {
        deps: ['chopper'],
        dev: ['chopper_generator', 'json_annotation', 'json_serializable','swagger_dart_code_generator']
    },
    'PDF': {
        deps: ['flutter_pdfview'],
        dev: []
    },
    'Webview': {
        deps: ['flutter_inappwebview'],
        dev: []
    },
    'Database': {
        deps: [],
        dev: []
    },
    'Sharing': {
        deps: ['share'],
        dev: []
    },
}
export class CreateProject {

    state:number = 0;
    spinner: any = undefined;

    constructor(){
        this.state = 0;
    }

    start(): void {
        // requires get_cli
        //'/Users/sj555jn/Documents/EY/SIA/flutter/bin/flutter pub global activate get_cli'
        //export PATH="$PATH":"$HOME/Documents/EY/SIA/flutter/.pub-cache/bin"
        //export PATH="$PATH":"/Users/sj555jn/Documents/EY/SIA/flutter/bin/"

        // Create Project
        if(this.state == 0) {
            this.spinner = ora('Create Project').start();

            this._doCmd('flutter', [
                'create', 
                '--ios-language', 'swift',
                '--android-language', 'kotlin',
                'mynewproject',
            ]);
        }
        
        // Install packages
        if(this.state == 1 ) {
            this._add_libs();
        }

        // END FMS
        /*
        else {
            this.spinner.stop();
        }
        */
    }

    _doCmd(cmdName: String, args: any, options: any = undefined, verbose: boolean = false, exit_cb: Function = undefined) {
        const cmd = spawn(cmdName, args, options);
        this._logCmd(cmd, verbose, exit_cb);
    }

    _logCmd(cmd:any, verbose: boolean, exit_cb: Function) {
        cmd.stdout.on("data", (data:any) => {
            if(verbose) {
                Log.t(`${data}`);
            }
        });

        cmd.stderr.on("data", (data:any) => {
            if(verbose) {
                Log.t(`${data}`, Log.WARN);
            }
        });

        cmd.on('error', (error:any) => {
            if(verbose) {
                Log.t(`${error.message}`, Log.ERROR);
            }
        });

        cmd.on("close", (code:any) => {
            if(verbose) {
                Log.t(`Exited with code ${code}`);
            }

            if(this.spinner != undefined) {
                this.spinner.stop();
            }

            if(exit_cb != undefined) {
                exit_cb();
                return;
            }

            this.state += 1;
            this.start();
        });
    }

    _add_libs() {
        this.spinner.stop();
        inquirer.prompt([
        {
            type: 'checkbox',
            message: 'Select Libraries',
            name: 'libs',
            choices: Object.keys(LIBS),
        },
        ])
        .then((answers:any) => {
            //Recursive install
            var libs = []
            var dev = []

            for(var index in answers.libs) {
                libs = [].concat(libs, LIBS[answers.libs[index]]['deps']);
                dev = [].concat(dev, LIBS[answers.libs[index]]['dev']);
            }

            this._install_lib(0, libs, false, () => {
                Log.t("Install DEV Libs", Log.WARN);
                this._install_lib(0, dev, true);
            });
        });
    }

    _install_lib(index, libs, dev:boolean= false, cb:Function = undefined): void {

        if(libs.length == index) {

            if(cb != undefined) {
                cb();
                return;
            }

            Log.t("Install libs finished", Log.WARN);

            this.state += 1;
            this.start();

            return;
        }

        this.spinner = ora('Install package ' + libs[index]).start();
        var cmd = [].concat(['install'], libs[index]);

        if(dev) {
            cmd = [].concat(cmd, ['--dev']);
        }
                
        this._doCmd('get', cmd, {cwd: 'mynewproject'}, true, () => {
            this.spinner.stop();
            this._install_lib(index+1, libs, dev, cb);
        });
    }
}