import {Log}  from '../utils/log';
import ora = require('ora');
import inquirer = require('inquirer');
import { isRegExp } from 'util';
import { exit } from 'process';
const { spawn } = require('child_process');

const STATES = {
    0: 'CREATE',
    1: 'ADD_LIBS',
    2: 'END'
};

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
            choices: [  
                //new inquirer.Separator(' = All = '),
                //{ name: 'all-bloc-with-http' },
                new inquirer.Separator(' = Essentials = '),
                { name: 'url-launcher' },
                //{ name: 'cupertino_icons' },
                { name: 'keyboard_visibility' },
                { name: 'path_provider' },
                { name: 'permission_handler' },
                new inquirer.Separator(' = Networking = '),
                { name: 'http' },
                new inquirer.Separator(' = Architecture = '),
                { name: 'flutter_bloc'},
                new inquirer.Separator(' = Extra = '),
                { name: 'flutter_pdfview' },
                { name: 'flutter_inappwebview' },
                { name: 'share' },
                { name: 'shared_preferences' },
            ],
            
        },
        ])
        .then((answers:any) => {

            //Recursive install
            this._install_lib(0, answers.libs);
        });
    }

    _install_lib(index, libs): void {

        if(libs.length == index) {
            Log.t("Install libs finished", Log.WARN);

            this.state += 1;
            this.start();

            return;
        }

        this.spinner = ora('Install package ' + libs[index]).start();
        var cmd = [].concat(['install'], libs[index]);
                
        this._doCmd('get', cmd, {cwd: 'mynewproject'}, true, () => {
            this.spinner.stop();
            this._install_lib(index+1, libs);
        });
    }
}