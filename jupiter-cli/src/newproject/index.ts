import {Log}  from '../utils/log';
import {CheckEnvironment} from './check';
import {CreateProject} from './create';
import inquirer = require('inquirer');


const ACTION_CREATE = 'action_create';
const ACTION_SINGLE_PLATFORM = 'action_single_platform';
const ACTION_CHECK = 'action_check';

export class NewProjectCli {

    constructor(){}


    start(): void {
        inquirer.prompt([
            {
                type: 'list',
                name: 'project',
                message: 'Choose the action:',
                choices: [
                    {value: ACTION_CREATE, name: 'Create a new project for Android and iOS' },
                    {value: ACTION_SINGLE_PLATFORM, name: 'Create a new project for a single Platform' },
                     new inquirer.Separator(),
                    {value: ACTION_CHECK, name: 'Check system settings' },
                ],
            }
        ])
        .then((answers) => {
           this.do_action(answers)
        });
    }

    do_action(answers): void {
        switch(answers.project) {
            case ACTION_CREATE: 
                new CreateProject().start();
                break;
            case ACTION_SINGLE_PLATFORM: break;
            case ACTION_CHECK: 
                new CheckEnvironment().start();
                break;
            default:
                Log.t("Invalid Action", Log.ERROR);
        }
    }
}